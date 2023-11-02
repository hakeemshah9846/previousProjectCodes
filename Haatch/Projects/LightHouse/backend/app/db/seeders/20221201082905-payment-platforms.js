"use strict";

module.exports = {
  up: (models, mongoose) => {
    return models.payment_platforms.insertMany([
      {
        _id: "638ee791e5ce3916c3843dc8",
        title: "СБЕР - Оплата картой",
        short_name: "СБЕР",
        url: "https://sber.ru",
        description: "",
        feilds: [
          {
            "label": "Username",
            "value": "userName",
            "secure": true
          },
          {
            "label": "Password",
            "value": "password",
            "secure": true
          },
          {
            "label": "Account Title",
            "value": "account_title",
            "secure": false
          }
        ],
        icon: "assets/payment_platforms/icons/sber_bank.svg",
        payload_type: "params",
        method: "POST",
        gateway: "sber-bank",
        payment_url: "https://3dsec.sberbank.ru/payment/rest/register.do",
        status_url: "https://3dsec.sberbank.ru/payment/rest/getOrderStatusExtended.do",
        order: 13,
        payment_process: "assets/payment_platforms/process/Оплата через СБЕР.pdf",
        status: "active",
        allowed: ["individual", "organization"]
      },
      {
        _id: "63ce5d94928564c4f59442d5",
        title: "SberPay",
        short_name: "SberPay",
        url: "https://sber.ru",
        description: "",
        feilds: [
          {
            "label": "Username",
            "value": "userName",
            "secure": true,
          },
          {
            "label": "Password",
            "value": "password",
            "secure": true,
          },
          {
            "label": "Account Title",
            "value": "account_title",
            "secure": false,
          }
        ],
        icon: "assets/payment_platforms/icons/sber_pay.svg",
        payload_type: "params",
        method: "POST",
        gateway: null,
        payment_url: "#",
        status_url: "#",
        order: 14,
        payment_process: "assets/payment_platforms/process/Оплата картой.pdf",
        status: "inactive",
        allowed: ["individual", "organization"]
      },
      {
        _id: "6368da988e005c667daac533",
        title: "Альфа-Банк - Оплата картой",
        short_name: "Альфа",
        url: "https://alfabank.ru",
        description: "",
        feilds: [
          {
            "label": "Username",
            "value": "userName",
            "secure": true,
          },
          {
            "label": "Password",
            "value": "password",
            "secure": true,
          },
          {
            "label": "Account Title",
            "value": "account_title",
            "secure": false,
          }
        ],
        icon: "assets/payment_platforms/icons/alpha_bank.svg",
        payload_type: "params",
        method: "POST",
        gateway: null,
        payment_url: "#",
        status_url: "#",
        order: 16,
        payment_process: "assets/payment_platforms/process/Оплата через Альфа-Банк.pdf",
        status: "active",
        allowed: ["individual", "organization"]
      },
      {
        _id: "6380aa2316af315ba265f679",
        title: "MIR Card",
        short_name: "MIR",
        url: "https://nspk.ru",
        description: "",
        feilds: [
          {
            "label": "Username",
            "value": "userName",
            "secure": true,
          },
          {
            "label": "Password",
            "value": "password",
            "secure": true,
          },
          {
            "label": "Account Title",
            "value": "account_title",
            "secure": false,
          }
        ],
        icon: "assets/payment_platforms/icons/mir_card.svg",
        payload_type: "params",
        method: "POST",
        gateway: null,
        payment_url: "#",
        status_url: "#",
        order: 3,
        payment_process: "assets/payment_platforms/process/Оплата картой.pdf",
        status: "inactive",
        allowed: ["individual", "organization"]
      },
      {
        _id: "6380aa7a16af315ba265f67c",
        title: "JCB",
        short_name: "JCB",
        url: "https://global.jcb",
        description: "",
        feilds: [
          {
            "label": "Username",
            "value": "userName",
            "secure": true,
          },
          {
            "label": "Password",
            "value": "password",
            "secure": true,
          },
          {
            "label": "Account Title",
            "value": "account_title",
            "secure": false,
          }
        ],
        icon: "assets/payment_platforms/icons/jcb.svg",
        payload_type: "params",
        method: "POST",
        gateway: null,
        payment_url: "#",
        status_url: "#",
        order: 12,
        payment_process: "assets/payment_platforms/process/Оплата картой.pdf",
        status: "inactive",
        allowed: ["individual", "organization"]
      },
      {
        _id: "63ce5d94928564c4f59442d1",
        title: "Mastercard",
        short_name: "Mastercard",
        url: "https://mastercard.ru",
        description: "",
        feilds: [
          {
            "label": "Username",
            "value": "userName",
            "secure": true,
          },
          {
            "label": "Password",
            "value": "password",
            "secure": true,
          },
          {
            "label": "Account Title",
            "value": "account_title",
            "secure": false,
          }
        ],
        icon: "assets/payment_platforms/icons/mastercard.svg",
        payload_type: "params",
        method: "POST",
        gateway: null,
        payment_url: "#",
        status_url: "#",
        order: 8,
        payment_process: "assets/payment_platforms/process/Оплата картой.pdf",
        status: "inactive",
        allowed: ["individual", "organization"]
      },
      {
        _id: "63ce5d94928564c4f59442d2",
        title: "PayKeeper",
        short_name: "PayKeeper",
        url: "https://paykeeper.ru",
        description: "",
        feilds: [
          {
            "label": "Username",
            "value": "userName",
            "secure": true,
          },
          {
            "label": "Password",
            "value": "password",
            "secure": true,
          },
          {
            "label": "Account Title",
            "value": "account_title",
            "secure": false,
          }
        ],
        icon: "assets/payment_platforms/icons/paykeeper.svg",
        payload_type: "params",
        method: "POST",
        gateway: null,
        payment_url: "#",
        status_url: "#",
        order: 1,
        payment_process: "assets/payment_platforms/process/Оплата картой.pdf",
        status: "inactive",
        allowed: ["individual", "organization"]
      },
      {
        _id: "63ce5d94928564c4f59442d3",
        title: "ПСБ - Оплата картой",
        short_name: "ПСБ",
        url: "https://psbank.ru",
        description: "",
        feilds: [
          {
            "label": "Username",
            "value": "userName",
            "secure": true,
          },
          {
            "label": "Password",
            "value": "password",
            "secure": true,
          },
          {
            "label": "Account Title",
            "value": "account_title",
            "secure": false,
          }
        ],
        icon: "assets/payment_platforms/icons/promsvyazbank.svg",
        payload_type: "params",
        method: "POST",
        gateway: null,
        payment_url: "#",
        status_url: "#",
        order: 18,
        payment_process: "assets/payment_platforms/process/Оплата через ПСБ.pdf",
        status: "active",
        allowed: ["individual", "organization"]
      },
      {
        _id: "63d2a0ce0680075e2847dbf6",
        title: "СБП",
        short_name: "СБП",
        url: "https://sbp.nspk.ru",
        description: "",
        feilds: [
          {
            "label": "Username",
            "value": "userName",
            "secure": true,
          },
          {
            "label": "Password",
            "value": "password",
            "secure": true,
          },
          {
            "label": "Account Title",
            "value": "account_title",
            "secure": false,
          }
        ],
        icon: "assets/payment_platforms/icons/sbp.svg",
        payload_type: "params",
        method: "POST",
        gateway: null,
        payment_url: "#",
        status_url: "#",
        order: 2,
        payment_process: "assets/payment_platforms/process/Оплата картой.pdf",
        status: "inactive",
        allowed: ["individual", "organization"]
      },
      {
        _id: "63ce5d94928564c4f59442d7",
        title: "Тинькофф - Оплата картой",
        short_name: "Тинькофф",
        url: "https://tinkoff.ru",
        description: "",
        feilds: [
          {
            "label": "Terminal Key",
            "value": "TerminalKey",
            "secure": true,
          },
          {
            "label": "Password",
            "value": "Password",
            "secure": true,
          },
          {
            "label": "Account Title",
            "value": "account_title",
            "secure": false,
          }
        ],
        icon: "assets/payment_platforms/icons/tinkoff.svg",
        payload_type: "body",
        method: "POST",
        gateway: "tinkoff",
        payment_url: "https://securepay.tinkoff.ru/v2/Init",
        status_url: "https://securepay/.tinkoff/.ru/v2/GetState",
        order: 17,
        payment_process: "assets/payment_platforms/process/Оплата через Тинькофф.pdf",
        status: "active",
        allowed: ["individual", "organization"]
      },
      {
        _id: "63ce5d94928564c4f59442d8",
        title: "UnionPay",
        short_name: "UnionPay",
        url: "https://unionpayintl.com",
        description: "",
        feilds: [
          {
            "label": "Username",
            "value": "userName",
            "secure": true,
          },
          {
            "label": "Password",
            "value": "password",
            "secure": true,
          },
          {
            "label": "Account Title",
            "value": "account_title",
            "secure": false,
          }
        ],
        icon: "assets/payment_platforms/icons/unionpay.svg",
        payload_type: "params",
        method: "POST",
        gateway: null,
        payment_url: "#",
        status_url: "#",
        order: 11,
        payment_process: "assets/payment_platforms/process/Оплата картой.pdf",
        status: "inactive",
        allowed: ["individual", "organization"]
      },
      {
        _id: "63d2a0ce0680075e2847dbf7",
        title: "Visa",
        short_name: "Visa",
        url: "https://visa.com",
        description: "",
        feilds: [
          {
            "label": "Username",
            "value": "userName",
            "secure": true,
          },
          {
            "label": "Password",
            "value": "password",
            "secure": true,
          },
          {
            "label": "Account Title",
            "value": "account_title",
            "secure": false,
          }
        ],
        icon: "assets/payment_platforms/icons/visa.svg",
        payload_type: "params",
        method: "POST",
        gateway: null,
        payment_url: "#",
        status_url: "#",
        order: 5,
        payment_process: "assets/payment_platforms/process/Оплата картой.pdf",
        status: "inactive",
        allowed: ["individual", "organization"]
      },
      {
        _id: "63ce5d94928564c4f59442da",
        title: "ВТБ - Оплата картой",
        short_name: "ВТБ",
        url: "https://vtb.ru",
        description: "",
        feilds: [
          {
            "label": "Username",
            "value": "userName",
            "secure": true,
          },
          {
            "label": "Password",
            "value": "password",
            "secure": true,
          },
          {
            "label": "Account Title",
            "value": "account_title",
            "secure": false,
          }
        ],
        icon: "assets/payment_platforms/icons/vtb.svg",
        payload_type: "params",
        method: "POST",
        gateway: null,
        payment_url: "#",
        status_url: "#",
        order: 15,
        payment_process: "assets/payment_platforms/process/Оплата через ВТБ.pdf",
        status: "active",
        allowed: ["individual", "organization"]
      },
      {
        _id: "63d2a0b60680075e2847dbf2",
        title: "Visa Secure",
        short_name: "Visa",
        url: "https://visa.com",
        description: "",
        feilds: [
          {
            "label": "Username",
            "value": "userName",
            "secure": true,
          },
          {
            "label": "Password",
            "value": "password",
            "secure": true,
          },
          {
            "label": "Account Title",
            "value": "account_title",
            "secure": false,
          }
        ],
        icon: "assets/payment_platforms/icons/visa_secure.svg",
        payload_type: "params",
        method: "POST",
        gateway: null,
        payment_url: "#",
        status_url: "#",
        order: 7,
        payment_process: "assets/payment_platforms/process/Оплата картой.pdf",
        status: "inactive",
        allowed: ["individual", "organization"]
      },
      {
        _id: "63d2a0bf0680075e2847dbf3",
        title: "Verified by Visa",
        short_name: "Visa",
        url: "https://visa.com",
        description: "",
        feilds: [
          {
            "label": "Username",
            "value": "userName",
            "secure": true,
          },
          {
            "label": "Password",
            "value": "password",
            "secure": true,
          },
          {
            "label": "Account Title",
            "value": "account_title",
            "secure": false,
          }
        ],
        icon: "assets/payment_platforms/icons/visa_verified.svg",
        payload_type: "params",
        method: "POST",
        gateway: null,
        payment_url: "#",
        status_url: "#",
        order: 6,
        payment_process: "assets/payment_platforms/process/Оплата картой.pdf",
        status: "inactive",
        allowed: ["individual", "organization"]
      },
      {
        _id: "63d2a0c70680075e2847dbf4",
        title: "MasterCard SecureCode",
        short_name: "Mastercard",
        url: "https://mastercard.ru",
        description: "",
        feilds: [
          {
            "label": "Username",
            "value": "userName",
            "secure": true,
          },
          {
            "label": "Password",
            "value": "password",
            "secure": true,
          },
          {
            "label": "Account Title",
            "value": "account_title",
            "secure": false,
          }
        ],
        icon: "assets/payment_platforms/icons/mastercard_secure_code.svg",
        payload_type: "params",
        method: "POST",
        gateway: null,
        payment_url: "#",
        status_url: "#",
        order: 9,
        payment_process: "assets/payment_platforms/process/Оплата картой.pdf",
        status: "inactive",
        allowed: ["individual", "organization"]
      },
      {
        _id: "63d2a0ce0680075e2847dbf5",
        title: "MasterCard ID Check",
        short_name: "Mastercard",
        url: "https://mastercard.ru",
        description: "",
        feilds: [
          {
            "label": "Username",
            "value": "userName",
            "secure": true,
          },
          {
            "label": "Password",
            "value": "password",
            "secure": true,
          },
          {
            "label": "Account Title",
            "value": "account_title",
            "secure": false,
          }
        ],
        icon: "assets/payment_platforms/icons/mastercard_id_check.svg",
        payload_type: "params",
        method: "POST",
        gateway: null,
        payment_url: "#",
        status_url: "#",
        order: 10,
        payment_process: "assets/payment_platforms/process/Оплата картой.pdf",
        status: "inactive",
        allowed: ["individual", "organization"]
      },
      
      {
        _id: "63d2a0ce0680075e2847dbf8",
        title: "MirAccept",
        short_name: "MirAccept",
        url: "https://nspk.ru",
        description: "",
        feilds: [
          {
            "label": "Username",
            "value": "userName",
            "secure": true,
          },
          {
            "label": "Password",
            "value": "password",
            "secure": true,
          },
          {
            "label": "Account Title",
            "value": "account_title",
            "secure": false,
          }
        ],
        icon: "assets/payment_platforms/icons/miraccept.svg",
        payload_type: "params",
        method: "POST",
        gateway: null,
        payment_url: "#",
        status_url: "#",
        order: 4,
        payment_process: "assets/payment_platforms/process/Оплата картой.pdf",
        status: "inactive",
        allowed: ["individual", "organization"]
      }
    ]).then((res) => {
      console.log(`Seeding Successful`);
    });
  },

  down: (models, mongoose) => {
    return models.payment_platforms.deleteMany({}).then((res) => {
      console.log(`Rollback Successful`);
    });
  }
};