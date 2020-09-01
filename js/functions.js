$(document).ready(function () {

	// Fixed Header
	$(window).on('scroll', function () {
		var hh = $('#mainHeader').outerHeight();
		if ($(this).scrollTop() > hh) {
			$('body').css('padding-top', hh);
			$('#mainHeader').addClass('sticky');
			$('#toTop').addClass('active');
		} else if ($(this).scrollTop() == 0) {
			$('body').css('padding-top', 0);
			$('#mainHeader').removeClass('sticky');
			$('#toTop').removeClass('active');
		}
	});

	// Lightbox
	$('.tc-lightbox .wrapper .close').on('click', function () {
		$(this).parents('.tc-lightbox').removeClass('active');
	});
	$('.tc-lightbox').on('click', function (e) {
		var wrapper = $(this).find('.wrapper');
		if (!wrapper.is(e.target) && wrapper.has(e.target).length === 0) {
			$(this).removeClass('active');
		}
	});

	// To Top
	$('#toTop').click(function () {
		$('html, body').animate({
			scrollTop: 0
		}, 800);
	});

	// Mobile Navigation
	$('#mainHeader .tc-navigation > a').click(function () {
		$('#mobileNavigation').addClass('active');
	});
	$('#mobileNavigation').click(function (e) {
		var wrapper = $(this).children('.wrapper');
		if (!wrapper.is(e.target) && wrapper.has(e.target).length === 0) {
			$(this).removeClass('active');
		}
	});

	// Depoimentos Slider
	$('.tc-testimonials .tc-slider').slick({
		arrows: false,
		dots: true,
		slidesToShow: 2,
		slidesToScroll: 2,
		speed: 800,
		autoplay: true,
		autoplaySpeed: 4000,
		responsive: [{
			breakpoint: 769,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
				adaptiveHeight: true
			}
		}, ]
	});

	// Function: Show Notification
	function tc_notification(type, id) {

		/* check type */
		if (type == 'error') {

			// ?= Card Code Match
			if (id == 'card_code') {
				/* setup vars */
				var message = 'Os códigos de ativação não coincidem.';
			}

			// ?= Password Match
			if (id == 'pw') {
				/* setup vars */
				var message = 'As senhas não coincidem.';
			}

			// ?= Invalid Zipcode
			if (id == 'zipcode') {
				/* setup vars */
				var message = 'O CEP informado é inválido.';
			}

			// ?= Invalid Date Format
			if (id == 'date') {
				/* setup vars */
				var message = 'Formato de data inválido.';
			}

			// ?= Ajax Call: 5
			if (id == 5) {
				/* setup vars */
				var message = 'Usuário informado já possui cartão ativo.';
			}

			// ?= Ajax Call: 6
			if (id == 6) {
				/* setup vars */
				var message = 'Código de ativação inválido ou já utilizado.';
			}

			// ?= Ajax Call: 12
			if (id == 12) {
				/* setup vars */
				var message = 'Erro interno. Verifique as informações cadastradas.';
			}
		}

		/* append and select element */
		$('body').append('<div class="tc-notification"></div>');
		var notification = $('.tc-notification');

		/* setup message and activate element */
		notification.html(message);
		notification.addClass(type + ' active');

		/* remove element after X seconds */
		setTimeout(function () {
			notification.removeClass('active');
			setTimeout(function () {
				notification.remove();
			}, 500);
		}, 3000);

	}

	// Function: Form Validation
	function tc_validate_form(form) {

		// Check for required fields
		$(form).find('.form-item[required]').each(function () {
			var format = $(this).data('format');
			if ($(this).children('input').val().length != 0) {
				$(this).removeClass('v-error');
			} else {
				$(this).addClass('v-error');
				if (format) {
					$(this).attr('data-error', 'Preencha corretamente: ' + format);
				} else {
					$(this).attr('data-error', 'Este campo é obrigatório.');
				}
			}
		});

		// Check for minimum length inputs
		$(form).find('.form-item[data-minlen]').each(function () {
			var minLen = $(this).data('minlen'),
				valLen = $(this).children('input').val().length,
				format = $(this).data('format');

			if (valLen >= minLen) {
				$(this).removeClass('v-error');
			} else if (valLen == 0) {
				$(this).addClass('v-error');
			} else {
				$(this).addClass('v-error');
			}
		});

		// Check for confirmation inputs
		$(form).find('.form-item input[name^="c_"]').each(function () {
			var name = $(this).attr('name').replace('c_', ''),
				cval = $(this).val(),
				cfor = $(this).parents('form').find('.form-item input[name="' + name + '"]');

			if (!$(this).parent().hasClass('v-error') && !cfor.parent().hasClass('v-error')) {
				if (cval == cfor.val()) {
					$(this).parent().removeClass('v-not_equal');
					cfor.parent().removeClass('v-not_equal');
				} else {
					$(this).parent().addClass('v-not_equal');
					cfor.parent().addClass('v-not_equal');
					tc_notification('error', name);
				}
			}
		});

		// Check for birthdate
		$(form).find('.form-item.t-date').each(function () {
			var value = $(this).children('input').val();

			/* check if all numbers were informed */
			if (value.length == 10) {
				var r_date = value.split('/'),
					d = parseInt(r_date[0], 10),
					m = parseInt(r_date[1], 10),
					y = parseInt(r_date[2], 10);

				/* check if date format is valid */
				var date = new Date(y, m - 1, d),
					dateD = date.getDate(),
					dateM = date.getMonth() + 1,
					dateY = date.getFullYear();

				if (dateY < 2100 && dateY > 1900 && dateD == d && dateM == m && dateY == y) {} else {
					$(this).addClass('v-error');
					tc_notification('error', 'date');
				}
			}
		});

		// Check for address inputs
		$(form).find('.form-item.r-address').each(function () {
			var value = $(this).children('input').val();
			if (value == 'CEP Inválido' || value == '--') {
				$(this).addClass('v-error');
			}
		});

		// Check for errors inside the form
		var errors = $(form).find('.form-item.v-error'),
			not_equal = $(form).find('.form-item.v-not_equal');

		if (errors.length == 0 && not_equal.length == 0) {
			return true;
		} else {
			$('html, body').animate({
				scrollTop: 0
			}, 1000);
			return false;
		}

	}

	// Card Activation – Input Masks
	$('.tc-form-card_activation .form-item').each(function () {

		// Date
		if ($(this).hasClass('t-date')) {
			$(this).children('input').mask('00/00/0000');
		}

		// CPF
		if ($(this).hasClass('t-cpf_number')) {
			$(this).children('input').mask('000.000.000-00');
		}

		// Phone Number
		if ($(this).hasClass('t-phone_number')) {
			var phoneMask = function (val) {
					return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
				},
				phoneMaskOptions = {
					onKeyPress: function (val, e, field, options) {
						field.mask(phoneMask.apply({}, arguments), options);
					}
				};
			$(this).children('input').mask(phoneMask, phoneMaskOptions);
		}

		// Zipcode
		if ($(this).hasClass('t-zipcode')) {
			$(this).children('input').mask('00000-000');
		}

		// Number
		if ($(this).hasClass('t-number')) {
			$(this).children('input').mask('0#');
		}

		// State
		if ($(this).hasClass('t-state')) {
			$(this).children('input').mask('SS');
		}

	});

	// Card Activation – Zipcode Autofill
	$('.tc-form-card_activation .form-item.t-zipcode input').on('blur', function () {
		var zipcode = $(this).val().replace('-', '');

		if (zipcode.length == 8) {

			/* setup vars for each input */
			var el_zipcode = $(this),
				el_street_address = $(this).parents('form').find('.form-item input#street'),
				el_district = $(this).parents('form').find('.form-item input#district'),
				el_city = $(this).parents('form').find('.form-item input#city'),
				el_state = $(this).parents('form').find('.form-item input#state');

			/* change each inputs value to checking */
			el_street_address.val('Consultando...');
			el_district.val('Consultando...');
			el_city.val('Consultando...');
			el_state.val('Consultando...');

			/* retrieve information */
			$.getJSON('//viacep.com.br/ws/' + zipcode + '/json/', function (data) {
				if (data.erro) {
					/* display notification and add error class to this input */
					tc_notification('error', 'zipcode');

					/* insert error message to other inputs */
					el_street_address.val('CEP Inválido');
					el_district.val('CEP Inválido');
					el_city.val('CEP Inválido');
					el_state.val('--');

				} else {
					/* setup vars for values */
					var street_address = data.logradouro,
						district = data.bairro,
						city = data.localidade,
						state = data.uf;

					/* remove error class from all address-related inputs */
					el_zipcode.parent().removeClass('v-error');
					el_street_address.parent().removeClass('v-error');
					el_district.parent().removeClass('v-error');
					el_city.parent().removeClass('v-error');
					el_state.parent().removeClass('v-error');

					/* output info */
					el_street_address.val(street_address);
					el_district.val(district);
					el_city.val(city);
					el_state.val(state);
				}
			});
		}
	});

	// Card Activation – Ajax Call
	$('.tc-form-card_activation').on('submit', function (e) {
		e.preventDefault();

		// Validate Form
		if (tc_validate_form(this)) {

			/* serialize form */
			var form = $(this),
				form_data = form.serialize();

			/* setup main vars */
			var action = form.attr('action'),
				btn_submit = form.find('input[type="submit"]');

			/* ajax function */
			$.ajax({
				url: action,
				method: 'get',
				data: form_data,
				dataType: 'json',
				beforeSend: function () {
					btn_submit.val('Consultando...');
				},
				success: function (data) {

					if (data.r == 1) {

						// Success
						window.location = "https://amolisboa.pt/finalizar/ativar/1";

					} else if (data.r == 5) {

						// Error
						// >> User already has an active card
						tc_notification('error', 5);

						// Scroll to top & add error class to inputs
						$('html, body').animate({
							scrollTop: 0
						}, 1000);
						form.find('.form-item input#cpf').parent().addClass('v-error');
						form.find('.form-item input#email').parent().addClass('v-error');

					} else if (data.r == 6) {

						// Error
						// >> Invalid or already active card
						tc_notification('error', 6);

						// Scroll to top, clear :card_code inputs & add error class to them
						$('html, body').animate({
							scrollTop: 0
						}, 1000);
						form.find('.form-item input#card_code').val('');
						form.find('.form-item input#c_card_code').val('');
						form.find('.form-item input#card_code').parent().addClass('v-error');
						form.find('.form-item input#c_card_code').parent().addClass('v-error');


					} else if (data.r == 12) {

						// Error
						// >> MySql Error
						tc_notification('error', 12);

						// Scroll to top
						$('html, body').animate({
							scrollTop: 0
						}, 1000);

					}

				},
				error: function (data) {
					console.log('Error: ' + data);
				}
			}).done(function () {
				btn_submit.val('Ativar Cartão');
			});

		}
	});

});