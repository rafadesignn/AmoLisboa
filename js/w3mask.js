//mascara
$(document).ready(function() {				
	var masks = ['(00) 00000-0000', '(00) 0000-00009'],
		maskBehavior = function(val, e, field, options) {
		return val.length > 14 ? masks[0] : masks[1];
	};

	$('#telefone').mask(maskBehavior, {onKeyPress: 
	   function(val, e, field, options) {
		   field.mask(maskBehavior(val, e, field, options), options);
	   }
	});

	$('.telefonee').mask(maskBehavior, {onKeyPress: 
	   function(val, e, field, options) {
		   field.mask(maskBehavior(val, e, field, options), options);
	   }
	});

	$(".data").mask("00/00/0000");
	$('.cpf').mask('000.000.000-00', {reverse: true});
	$(".cep").mask("00000-000");
	$("#validade").mask("00/00");
	$("#numerocartao").mask("0000.0000.0000.0000");
	$("#codigoseguranca").mask("000");
	$('.money').mask('000.000.000.000.000,00', {reverse: true});
    $('.money2').mask("#.##0,00", {reverse: true});

    // Masks
    $('.t-phone').mask(maskBehavior, {onKeyPress: 
	   function(val, e, field, options) {
		   field.mask(maskBehavior(val, e, field, options), options);
	   }
	});
	$('.t-cpf').mask('000.000.000-00');
});