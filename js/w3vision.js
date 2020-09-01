// Setting the application NameSpace
var MyApplication = window.MyApplication || {};
MyApplication.CheckoutPage = new function() {

    /**
    * Função para preenchimento do cep via webservice
    */
    function limpa_formulário_cep() {
        // Limpa valores do formulário de cep.
        $("#rua").val("");
        $("#bairro").val("");
        $("#cidade").val("");
        $("#uf").val("");
        $("#ibge").val("");
    }

    //Quando o campo cep perde o foco.
    $("#cep").blur(function() {
        //alert("cep");
        //Nova variável "cep" somente com dígitos.
        var cep = $(this).val().replace(/\D/g, '');
        
        //Verifica se campo cep possui valor informado.
        if (cep != "") {

            //Expressão regular para validar o CEP.
            var validacep = /^[0-9]{8}$/;

            //Valida o formato do CEP.
            if(validacep.test(cep)) {

                //Preenche os campos com "..." enquanto consulta webservice.
                $("#rua").val("consultando...")
                $("#bairro").val("consultado...")
                $("#cidade").val("consultando...")
                $("#uf").val("consultado...")
                $("#ibge").val("consultado...")

                //Consulta o webservice viacep.com.br/
                $.getJSON("//viacep.com.br/ws/"+ cep +"/json/?callback=?", function(dados) {

                    if (!("erro" in dados)) {
                        //Atualiza os campos com os valores da consulta.
                        $("#rua").val(dados.logradouro);
                        $("#bairro").val(dados.bairro);
                        $("#cidade").val(dados.localidade);
                        $("#uf").val(dados.uf);
                        $("#ibge").val(dados.ibge);
                    } //end if.
                    else {
                        //CEP pesquisado não foi encontrado.
                        limpa_formulário_cep();                   
                    }
                });
            } //end if.
            else {
                //cep é inválido.
                limpa_formulário_cep();           
            }
        } //end if.
        else {
            //cep sem valor, limpa formulário.
            limpa_formulário_cep();
        }
    });

    $('.form-guia').each(function() {
      var form = this;

      $(this).find('input[name="opcaodiauso"]').on('change', function() {
        $(form).find('input[name="opcaodiauso"]').not(this).prop("checked", false);
      });

      $(this).find('select, input').on('change', function() {
        var type     = $(form).find('#tipoestabelecimento').val(),
            location = $(form).find('#bairroestabelecimento').val(),
            days     = $(form).find('input[name="opcaodiauso"]:checked').data('id');

        if (days === null) {days = "";}

        if (type.length == 0)     {type = false;}
        if (location.length == 0) {location = false;}
        if (days.length == 0)     {days = false;}

        buscafiltro(type,location,days);
      });
    });

    var buscafiltro = function(type,location,days) {
      var idc = $("#idcategoria").val();

      // setup data
      var data = {"idc": idc};

      if (type)     {data.tipoe   = type;}
      if (location) {data.bairroe = location;}
      if (days)     {data.diauso  = days;}

      $.ajax({
        url: "//amolisboa.pt/inc/viewresultadobuscacategoria.inc.php",
        type: "POST",
        data: data,
        cache: false,
        success: function(response) {
          // console.log(response);
          $("#buscategoria").html(response);
        },
        error: function() {
          alert(" Não foi possível completar a solicitação! ");
        },
      });
    }

    $('.form-guia-home').each(function() {
      var form = this;      
      var formname = $(form).attr('name');           

      $(this).find('.combof').on('change', function() {
       

        var type     = $(form).find('#tipoestabelecimentoh'+formname+'').val(),
            location = $(form).find('#bairroestabelecimentoh'+formname+'').val(),
            days     = $(form).find('#diasusoguiah'+formname+'').val(),
            idc      = $(form).find('#categoriah'+formname+'').val(),
            combon   =  this.name;
            
        if (days === null) {days = "";}
        if (type.length == 0)     {type = false;}
        if (location.length == 0) {location = false;}
        if (days.length == 0)     {days = false;}
        if (idc.length == 0)     {idc = 0;}                 
        
        buscafiltrohome(type,location,days,idc,combon,formname);        

      });
    });

    var buscafiltrohome = function(type,location,days,idc,combon,formname) {      
      
      // setup data
      var data = {"idc": idc, "combo": combon};

      if (type)     {data.tipoe   = type;}
      if (location) {data.bairroe = location;}
      if (days)     {data.diauso  = days;}     

      $.ajax({
        url: "inc/viewresultadocombofiltroshome.inc.php",
        type: "POST",
        dataType: 'json',        
        data: data,
        cache: false,
        success: function(response) {  
                          
        if (response.combo == 'tipoe') {         	
        	$("#tipoestabelecimentoh"+formname+"").html(response.dados);
        }

        if (response.combo == 'bairroe') {         	
        	$("#bairroestabelecimentoh"+formname+"").html(response.dados);
        }

        if (response.combo == 'diae') {          
          $("#diasusoguiah"+formname+"").html(response.dados);
        }       
        
          
        },
        error: function() {
          alert(" Não foi possível completar a solicitação de busca por filtros! ");
        },
      });
    }

    // var buscaestabelecimento = function() {

    //     //variaves 
    //     var tipoe = $("#tipoestabelecimento").val();
    //     var bairroe = $("#bairroestabelecimento").val();
    //     var diasusue = $("input[name='diasuso']").val();
    //     var diauso = $("input[name='opcaodiauso']");
    //     var diasuso = diauso.filter(":checked").attr("data-id");

    //     $("#tipoestabelecimento").change(function() {
            
    //         tipoe = $(this).val();            
    //         buscafiltro(tipoe,bairroe,diasuso);

    //     }); 

    //     $("#bairroestabelecimento").change(function() {
            
    //         bairroe = $(this).val();
    //         buscafiltro(tipoe,bairroe,diasuso);           
           
    //     }); 
    //         diauso.click(function(){

    //         diasuso = diauso.filter(":checked").attr("data-id");
    //         buscafiltro(tipoe,bairroe,diasuso);

    //     });

    // }

    // combo busca
     $(document).ready(function() {  
    	 
        // buscaestabelecimento();

        $("body").on("click", "#his_usoc [type=button]", function() {    
            var datai = $("#datai").val();
            var dataf = $("#dataf").val();
            
              $("#dadoscartao").html('Aguarde!');      
            
            $.ajax({
              type:"POST",
              url:"/inc/viewmeuhistoricodatautilizacao.inc.php",
              data:{"datai" : datai, "dataf" : dataf},
              beforeSend: function(){
              },
              success:function(data){          
                $("#dadoscartao").html(data);       
                //$(_init);       
              }
            });
        });

        $( "#formlogin" ).submit(function( event ) {
          var p = document.createElement("input");
           // Adiciona o novo elemento ao nosso formulário.           
           var form = $( "#formlogin" );
                
           form.append(p);
           p.name = "p";
           p.type = "hidden"
           p.value = hex_sha512(pw.value);
             
           // Certifica que senhas em texto plano não sejam enviadas.
           pw.value = "";           
           //event.preventDefault();          
        });

        $( "#formaltsenha" ).submit(function( event ) {
          var p = document.createElement("input");
          var pp = document.createElement("input");
           // Adiciona o novo elemento ao nosso formulário.           
           var form = $( "#formaltsenha" );
           
           form.append(p);
           form.append(pp);           

           p.name = "p";
           p.type = "hidden"
           p.value = hex_sha512(pw.value);
           
           
           pp.name = "pp";
           pp.type = "hidden"
           pp.value = hex_sha512(pwc.value);           
           
           // Certifica que senhas em texto plano não sejam enviadas.
           pw.value = "";
           pwc.value = "";            
           //event.preventDefault();          
        });  
      
     });

};
