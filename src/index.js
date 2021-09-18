const express = require('express');

const app = express()

const mercadopago = require('mercadopago');

mercadopago.configure({
    access_token: 'APP_USR-334491433003961-030821-12d7475807d694b645722c1946d5ce5a-725736327',
    integrator_id: 'dev_24c65fb163bf11ea96500242ac130004'
})

//mercadopago.configurations.setAccessToken('APP_USR-334491433003961-030821-12d7475807d694b645722c1946d5ce5a-725736327'); 

app.use(express.urlencoded({ extended: false }));

app.post("/checkout", (req, res) => {

	let preference = {
		items: [{
            id: "1234",
			title: req.body.title,
            currency_id: "BRL",
            picture_url: req.body.img,
            description: "Celular de Tienda e-commerce",
            category_id: "other",
			unit_price: Number(req.body.price),
			quantity: parseInt(req.body.quantity),
		}],

        payer: {
            name: "Lalo",
            surname: "Landa",
            email: "test_user_92801501@testuser.com",
            phone: {
                area_code: "55",
                number: 985298743
            },
            identification: {
                type: "CPF",
                number: "19119119100"
            },
            address: {
                street_name: "Insurgentes Sur",
                street_number: 1602,
                zip_code: "78134-190"
            }
        },
		back_urls: {
			"success": "https://adrianavr2002-mp-ecommerce.herokuapp.com/success",
			"failure": "https://adrianavr2002-mp-ecommerce.herokuapp.com/failure",
			"pending": "https://adrianavr2002-mp-ecommerce.herokuapp.com/pending"
		},
		auto_return: 'approved',
        payment_methods: {
            excluded_payment_methods: [ {
                    id: "amex"
                } ],
            installments: 6
        },
        notification_url: "https://webhook.site/d2dc549b-21f7-4fd2-927f-32c650e35a8e",
        statement_descriptor: "MEUNEGOCIO",
        external_reference: "adrianavr2002@yahoo.com.br",
        expires: true,
        integrator_id: "dev_24c65fb163bf11ea96500242ac130004"
	};

	mercadopago.preferences.create(preference)
		.then(function (response) {
            console.log(`Preferência gerada: ${response.body.id}`)
			//res.json({id :response.body.id})

            // http://localhost:3001/detail?img=.%2Fassets%2Fl6g6.jpg&title=LG+G6&price=10000&unit=1

            res.redirect('https://adrianavr2002-mp-ecommerce.herokuapp.com/detail?img='+response.body.items[0].picture_url+'&id='+response.body.id+'&title='+response.body.items[0].title+'&price='+response.body.items[0].unit_price+'&unit='+response.body.items[0].quantity)
           
		}).catch(function (error) {
			console.log(error);
		});
});

const port = process.env.PORT || 8080

app.listen(port, () => {
  console.log("The server is now running on Port "+port);
});
