"use strict";

module.exports = {
  up: (models, mongoose) => {
    return models.users.insertMany([
      {
        _id: "63592f9e29fa6431e563fe02",
        first_name: "Администрация",
        last_name: "Помоград",
        image: "uploads/users/167480600914961.png",
        description: "Администрация проекта Помоград",
        gender: "Male",
        phone: "+79895130033",
        email: "admin@pomograd.ru",
        password: "$2a$10$s2Nu30GwJ6ulFOCevtrMpO3JVHHixXl8fnvRpvyu9H6L1kkjm8Jw6",
        occupation: "Администрация",
        date_of_birth: "1984-05-12",
        birth_place: "",
        father_name: "",
        country: "Russia",
        passport: {
          "code": "900-002",
          "number": "0914233846",
          "files": [
            {
              "title": "Паспорт РФ - Такеш Абдель Хамид Мохаммад.jpg",
              "url": "uploads/users/167480626441518.jpeg",
              "_id": "63d383f8e9745293c0117a64"
            }
          ],
          "issued_region": "ФЕДЕРАЛЬНАЯ МИГРАЦИОННАЯ СЛУЖБА",
          "issue_date": "2014-07-07",
          "expiry_date": "10-10-2020",
          "passport_authority": "string",
          "passport_code_authority": "string"
        },
        social_media: [
          {
            "platform": "6363bba02ff1ca41d9a43d8c",
            "url": "https://rutube.ru",
            "username": "pomograd",
            "label": "Помоград",
            "_id": "6380d6aa14494a2161a8a426"
          },
          {
            "platform": "6380c37516af315ba265f682",
            "url": "https://vk.ru",
            "username": "pomograd",
            "label": "Помоград",
            "_id": "6380d6aa14494a2161a8a427"
          },
          {
            "platform": "6380c38e16af315ba265f684",
            "url": "https://dzen.ru/",
            "username": "pomograd",
            "label": "Помоград",
            "_id": "6380d6aa14494a2161a8a428"
          },
          {
            "platform": "6380c3a416af315ba265f686",
            "url": "https://t.me/pomograd",
            "username": "pomograd",
            "label": "Помоград",
            "_id": "6380d6aa14494a2161a8a429"
          }
        ],
        type: "admin",
        account_type: "individual",
        payment_templates: [
          {
            "platform":"6368da988e005c667daac533",
            "platform_data": {
              "upi_id": "peterpan@neverlandbank"
            },
            "_id": "6368e62e07b1e71a1bbc23a4"
          },
          {
            "platform": "6380aa2316af315ba265f679",
            "platform_data": {
              "paypal_id": "captainhook@paypal.com"
            },
            "_id": "6380d73414494a2161a8a46f"
          },
          {
            "platform": "6380aa7a16af315ba265f67c",
            "platform_data": {
              "paypal_id": "captainhook@paypal.com",
              "bank_name": "Neverland National Bank",
              "account_holder": "Captain Hook",
              "account_number": "12458963780",
              "ifsc_code": "124578"
            },
            "_id": "6380d75714494a2161a8a47b"
          },
          {
            "platform": "638ee791e5ce3916c3843dc8",
            "platform_data": {
              "password": "R84AfxtQ",
              "userName": "t780161868895-api"
            },
            "_id": "638f47281332bb48d7f3a184"
          }
        ],
        status: "active",
        last_login: "2023-01-27T12:55:51+00:00",
        updated_on: "2023-01-27T11:18:39+00:00",
        updated_by: "63592f9e29fa6431e563fe02",
        inn: {
          "number": 6164140150,
          "data": "{\"items\":[{\"ЮЛ\":{\"ИНН\":\"6164140150\",\"КПП\":\"616401001\",\"ОГРН\":\"1226100034599\",\"ДатаОГРН\":\"2022-12-23\",\"ДатаРег\":\"2022-12-23\",\"ОКОПФ\":\"Общества с ограниченной ответственностью\",\"КодОКОПФ\":\"12300\",\"Статус\":\"Действующее\",\"СпОбрЮЛ\":\"Создание юридического лица\",\"НО\":{\"Рег\":\"6196 (Межрайонная инспекция Федеральной налоговой службы № 26 по Ростовской области)\",\"РегДата\":\"2022-12-23\",\"Учет\":\"6164 (Инспекция Федеральной налоговой службы по Ленинскому району г.Ростова-на-Дону)\",\"УчетДата\":\"2022-12-23\"},\"ПФ\":{\"РегНомПФ\":\"071059057891\",\"ДатаРегПФ\":\"2022-12-26\",\"КодПФ\":\"071059 (Отделение Фонда пенсионного и социального страхования Российской Федерации по Ростовской области)\"},\"КодыСтат\":{\"ОКПО\":\"0049845527\",\"ОКТМО\":\"60701000001\",\"ОКФС\":\"16\",\"ОКОГУ\":\"4210014\"},\"Капитал\":{\"ВидКап\":\"Уставный капитал\",\"СумКап\":\"10000\",\"Дата\":\"2022-12-23\"},\"НаимСокрЮЛ\":\"ООО «ПОМОГРАД»\",\"НаимПолнЮЛ\":\"ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ «ПОМОГРАД»\",\"Адрес\":{\"КодРегион\":\"61\",\"Индекс\":\"344082\",\"АдресПолн\":\"обл. Ростовская, г. Ростов-На-Дону, ул. Большая Садовая, д.32/36, ком.6\",\"ИдНомФИАС\":\"67503538\",\"АдресДетали\":{\"Регион\":{\"Тип\":\"ОБЛАСТЬ\",\"Наим\":\"РОСТОВСКАЯ\"},\"Город\":{\"Тип\":\"ГОРОД\",\"Наим\":\"РОСТОВ-НА-ДОНУ\"},\"Улица\":{\"Тип\":\"УЛИЦА\",\"Наим\":\"БОЛЬШАЯ САДОВАЯ\"},\"Дом\":\"ДОМ 32/36\",\"Помещ\":\"КОМН. 6\"},\"Дата\":\"2022-12-23\"},\"Руководитель\":{\"ВидДолжн\":\"Руководитель юридического лица\",\"Должн\":\"Генеральный директор\",\"ФИОПолн\":\"Такеш Абдель Хамид Мохаммад\",\"ИННФЛ\":\"910411442260\",\"Пол\":\"Мужской\",\"ВидГражд\":\"Гражданин РФ\",\"Дата\":\"2022-12-23\"},\"Учредители\":[{\"УчрФЛ\":{\"ФИОПолн\":\"Такеш Абдель Хамид Мохаммад\",\"ИННФЛ\":\"910411442260\",\"Пол\":\"Мужской\",\"ВидГражд\":\"Гражданин РФ\"},\"СуммаУК\":\"10000\",\"Процент\":\"100\",\"Дата\":\"2022-12-23\"}],\"Контакты\":{\"e-mail\":[\"hamid.takesh@yandex.ru\"]},\"E-mail\":\"HAMID.TAKESH@YANDEX.RU\",\"ОснВидДеят\":{\"Код\":\"62.01\",\"Текст\":\"Разработка компьютерного программного обеспечения\",\"Дата\":\"2022-12-23\"},\"ДопВидДеят\":[{\"Код\":\"62.02\",\"Текст\":\"Деятельность консультативная и работы в области компьютерных технологий\",\"Дата\":\"2022-12-23\"},{\"Код\":\"62.02.1\",\"Текст\":\"Деятельность по планированию, проектированию компьютерных систем\",\"Дата\":\"2022-12-23\"},{\"Код\":\"62.02.2\",\"Текст\":\"Деятельность по обследованию и экспертизе компьютерных систем\",\"Дата\":\"2022-12-23\"},{\"Код\":\"62.02.4\",\"Текст\":\"Деятельность по подготовке компьютерных систем к эксплуатации\",\"Дата\":\"2022-12-23\"},{\"Код\":\"62.03\",\"Текст\":\"Деятельность по управлению компьютерным оборудованием\",\"Дата\":\"2022-12-23\"},{\"Код\":\"63.11\",\"Текст\":\"Деятельность по обработке данных, предоставление услуг по размещению информации и связанная с этим деятельность\",\"Дата\":\"2022-12-23\"},{\"Код\":\"63.11.1\",\"Текст\":\"Деятельность по созданию и использованию баз данных и информационных ресурсов\",\"Дата\":\"2022-12-23\"},{\"Код\":\"63.11.9\",\"Текст\":\"Деятельность по предоставлению услуг по размещению информации прочая\",\"Дата\":\"2022-12-23\"},{\"Код\":\"64.19\",\"Текст\":\"Денежное посредничество прочее\",\"Дата\":\"2022-12-23\"},{\"Код\":\"64.99\",\"Текст\":\"Предоставление прочих финансовых услуг, кроме услуг по страхованию и пенсионному обеспечению, не включенных в другие группировки\",\"Дата\":\"2022-12-23\"},{\"Код\":\"64.99.6\",\"Текст\":\"Деятельность по финансовой взаимопомощи\",\"Дата\":\"2022-12-23\"},{\"Код\":\"94.99\",\"Текст\":\"Деятельность прочих общественных организаций, не включенных в другие группировки\",\"Дата\":\"2022-12-23\"}],\"СПВЗ\":[{\"Дата\":\"2022-12-27\",\"Текст\":\"Представление сведений о регистрации юридического лица в качестве страхователя в территориальном органе Пенсионного фонда Российской Федерации\"},{\"Дата\":\"2022-12-23\",\"Текст\":\"Представление сведений об учете юридического лица в налоговом органе\"},{\"Дата\":\"2022-12-23\",\"Текст\":\"Создание юридического лица\"}],\"История\":{}}}]}"
        },
        short_name: "pomograd"
      },
      {
        _id: "637490cfda65643508dd8914",
        email: "peterpan@lighthouse.ru",
        password:
          "$2a$10$s2Nu30GwJ6ulFOCevtrMpO3JVHHixXl8fnvRpvyu9H6L1kkjm8Jw6",
        type: "volunteer",
        account_type: "individual",
        status: "active",
        created_at: {
          $date: {
            $numberLong: "1666789278941",
          },
        },
        updated_at: {
          $date: {
            $numberLong: "1666789278941",
          },
        },
        last_login: "2022-11-25T19:58:25+05:30",
        birth_place: "Neverland City",
        country: "Neverland City",
        date_of_birth: "10-10-2010",
        description:
          "A mischievous boy who can fly and magically refuses to grow up, Peter Pan spends his never-ending childhood adventuring on the island of Neverland as the leader of his gang the Lost Boys.",
        father_name: "Captain Hook",
        first_name: "Peter",
        gender: "Male",
        image: "uploads/users/16693848632668.png",
        last_name: "Pan",
        occupation: "Runner",
        passport: {
          code: "A10EP3",
          number: "A10EP3-21168",
          files: [
            {
              title: "passport_front_side",
              url: "uploads/users/166748088718799.png",
              _id: "6363bd370e178b683d74ca1e",
            },
          ],
          issued_region: "Neverland City",
          issue_date: "10-10-2020",
          expiry_date: "10-10-2020",
          passport_authority: "string",
          passport_code_authority: "string",
        },
        phone: "+91234567890",
        social_media: [
          {
            platform: "6363bba02ff1ca41d9a43d8c",
            url: "https://facebook.com/peter_pan",
            _id: "6363bd370e178b683d74ca1f",
          },
          {
            platform: "6380c37516af315ba265f682",
            url: "https://instagram.com/peter_pan",
            _id: "6380ca9f14494a2161a89ce9",
          },
          {
            platform: "6380c38e16af315ba265f684",
            url: "https://twitter.com/peter_pan",
            _id: "6380ca9f14494a2161a89cea",
          },
          {
            platform: "6380c3a416af315ba265f686",
            url: "https://t.me/peter_pan",
            _id: "6380ca9f14494a2161a89ceb",
          },
        ],
        updated_by: "637490cfda65643508dd8914",
        updated_on: "2022-11-25T19:31:03+05:30",
        payment_templates: [
          {
            platform_data: {
              upi_id: "peterpan@neverlandbank",
            },
            _id: "6368e62e07b1e71a1bbc23a4",
            platform: "6368da988e005c667daac533",
          },
          {
            platform: "6380aa2316af315ba265f679",
            platform_data: {
              paypal_id: "peterpan@paypal.com",
            },
            _id: "6380caa814494a2161a89d0a",
          },
          {
            platform: "6380aa7a16af315ba265f67c",
            platform_data: {
              paypal_id: "peterpan@paypal.com",
              bank_name: "Neverland National Bank",
              account_holder: "Peter Pan",
              account_number: "12456789320",
              ifsc_code: "124587",
            },
            _id: "6380cab514494a2161a89d16",
          },
          {
            platform: "638ee791e5ce3916c3843dc8",
            platform_data: {
              password: "R84AfxtQ",
              userName: "t780161868895-api"
            },
            _id: "638f47281332bb48d7f3a182"
          }
        ],
      },
      {
        _id: "637490eeda65643508dd8916",
        email: "olivertwist@lighthouse.ru",
        password:
          "$2a$10$s2Nu30GwJ6ulFOCevtrMpO3JVHHixXl8fnvRpvyu9H6L1kkjm8Jw6",
        type: "volunteer",
        account_type: "individual",
        status: "active",
        created_at: {
          $date: {
            $numberLong: "1666789278941",
          },
        },
        updated_at: {
          $date: {
            $numberLong: "1666789278941",
          },
        },
        last_login: "2022-11-25T19:58:08+05:30",
        birth_place: "Neverland City",
        country: "Neverland",
        date_of_birth: "10-10-2010",
        description:
          "I'm Oliver Twist of Neverland City, every nook and corner know me well. Running away is my new habit but I always manage to find a twist at the end. That's me Oliver Twist.",
        father_name: "Captain Hook",
        first_name: "Oliver",
        gender: "Male",
        image: "uploads/users/166938597490986.png",
        last_name: "Twist",
        occupation: "Twist Maker",
        passport: {
          code: "A10EP3",
          number: "A10EP3-21168",
          files: [
            {
              title: "passport_front_side",
              url: "uploads/users/166748088718799.png",
              _id: "6363bd370e178b683d74ca1e",
            },
          ],
          issued_region: "Neverland City",
          issue_date: "10-10-2020",
          expiry_date: "10-10-2020",
          passport_authority: "string",
          passport_code_authority: "string",
        },
        phone: "+91234567890",
        social_media: [
          {
            platform: "6363bba02ff1ca41d9a43d8c",
            url: "https://facebook.com/oliwer_twist",
            _id: "6363bd370e178b683d74ca1f",
          },
          {
            platform: "6380c37516af315ba265f682",
            url: "https://instagram.com/oliwer_twist",
            _id: "6380ceb614494a2161a89e2a",
          },
          {
            platform: "6380c38e16af315ba265f684",
            url: "https://twitter.com/oliwer_twist",
            _id: "6380ceb614494a2161a89e2b",
          },
          {
            platform: "6380c3a416af315ba265f686",
            url: "https://t.me/oliwer_twist",
            _id: "6380ceb614494a2161a89e2c",
          },
        ],
        updated_by: "637490eeda65643508dd8916",
        updated_on: "2022-11-25T19:50:49+05:30",
        payment_templates: [
          {
            platform_data: {
              upi_id: "oliwer_twist@neverlandbank",
            },
            _id: "6368e62e07b1e71a1bbc23a4",
            platform: "6368da988e005c667daac533",
          },
          {
            platform: "6380aa2316af315ba265f679",
            platform_data: {
              paypal_id: "olivertwist@paypal.com",
            },
            _id: "6380cf9214494a2161a89e99",
          },
          {
            platform: "6380aa7a16af315ba265f67c",
            platform_data: {
              paypal_id: "olivertwist@paypal.com",
              bank_name: "Neverland National Bank",
              account_holder: "Oliver Twist",
              account_number: "1245789630",
              ifsc_code: "124578",
            },
            _id: "6380cfab14494a2161a89ea5",
          },
          {
            platform: "638ee791e5ce3916c3843dc8",
            platform_data: {
              password: "R84AfxtQ",
              userName: "t780161868895-api"
            },
            _id: "638f47281332bb48d7f3a181"
          }
        ],
      },
      {
        _id: "637490ffda65643508dd8918",
        email: "jacksparrow@lighthouse.ru",
        password:
          "$2a$10$s2Nu30GwJ6ulFOCevtrMpO3JVHHixXl8fnvRpvyu9H6L1kkjm8Jw6",
        type: "curator",
        account_type: "individual",
        status: "active",
        created_at: {
          $date: {
            $numberLong: "1666789278941",
          },
        },
        updated_at: {
          $date: {
            $numberLong: "1666789278941",
          },
        },
        last_login: "2022-11-25T20:05:45+05:30",
        birth_place: "Neverland City",
        country: "Neverland",
        date_of_birth: "10-10-2010",
        description:
          "I'm the pirate of Neverland Sea, trouble maker for Mr. Hooks. I really don't have much to say about me, I may be a pity pirate, but you have heard about me right ?. I am Captain Jack Sparrow, the Legend of Caribbean sea",
        father_name: "Captain Hook",
        first_name: "Jack",
        gender: "Male",
        image: "uploads/users/166938268342168.jpeg",
        last_name: "Sparrow",
        occupation: "Pirate",
        passport: {
          code: "A10EP3",
          number: "A10EP3-21168",
          files: [
            {
              title: "passport_front_side",
              url: "uploads/users/166748088718799.png",
              _id: "6363bd370e178b683d74ca1e",
            },
          ],
          issued_region: "Neverland City",
          issue_date: "10-10-2020",
          expiry_date: "10-10-2020",
          passport_authority: "string",
          passport_code_authority: "string",
        },
        phone: "+91234567890",
        social_media: [
          {
            platform: "6363bba02ff1ca41d9a43d8c",
            url: "https://facebook.com/jact_sparrow",
            _id: "6363bd370e178b683d74ca1f",
          },
          {
            platform: "6380c37516af315ba265f682",
            url: "https://instagram.com/jact_sparrow",
            _id: "6380c3e014494a2161a89b80",
          },
          {
            platform: "6380c38e16af315ba265f684",
            url: "https://twitter.com/jact_sparrow",
            _id: "6380c3e014494a2161a89b81",
          },
          {
            platform: "6380c3a416af315ba265f686",
            url: "https://t.me/jact_sparrow",
            _id: "6380c3e014494a2161a89b82",
          },
        ],
        updated_by: "637490ffda65643508dd8918",
        updated_on: "2022-11-25T19:02:58+05:30",
        payment_templates: [
          {
            platform_data: {
              upi_id: "jact_sparrow@neverlandbank",
            },
            _id: "6368e62e07b1e71a1bbc23a4",
            platform: "6368da988e005c667daac533",
          },
          {
            platform: "6380aa2316af315ba265f679",
            platform_data: {
              paypal_id: "jacksparrow@paypal.com",
            },
            _id: "6380c4b414494a2161a89bc8",
          },
          {
            platform: "6380aa7a16af315ba265f67c",
            platform_data: {
              paypal_id: "jacksparrow@paypal.com",
              bank_name: "Caribbean Ocean Bank",
              account_holder: "Jack Sparrow",
              account_number: "1234587951265",
              ifsc_code: "123654",
            },
            _id: "6380c52c14494a2161a89bd4",
          },
          {
            platform: "638ee791e5ce3916c3843dc8",
            platform_data: {
              password: "R84AfxtQ",
              userName: "t780161868895-api"
            },
            _id: "638f47281332bb48d7f3a180"
          }
        ],
      },
      {
        _id: "63749107da65643508dd891a",
        email: "harrypotter@lighthouse.ru",
        password:
          "$2a$10$s2Nu30GwJ6ulFOCevtrMpO3JVHHixXl8fnvRpvyu9H6L1kkjm8Jw6",
        type: "curator",
        account_type: "individual",
        status: "active",
        created_at: {
          $date: {
            $numberLong: "1666789278941",
          },
        },
        updated_at: {
          $date: {
            $numberLong: "1666789278941",
          },
        },
        last_login: "2022-11-25T20:00:07+05:30",
        birth_place: "Neverland City",
        country: "Neverland",
        date_of_birth: "10-10-2010",
        description:
          "Let me introduce myself I'm the wizard boy, humble human being just like everyone else. So what makes the difference is that I craft spells with my wand, Wingardium Leviosa ✨",
        father_name: "Captain Hook",
        first_name: "Harry",
        gender: "Male",
        image: "uploads/users/166938750871968.png",
        last_name: "Potter",
        occupation: "Magician",
        passport: {
          code: "A10EP3",
          number: "A10EP3-21168",
          files: [
            {
              title: "passport_front_side",
              url: "uploads/users/166748088718799.png",
              _id: "6363bd370e178b683d74ca1e",
            },
          ],
          issued_region: "Neverland City",
          issue_date: "10-10-2020",
          expiry_date: "10-10-2020",
          passport_authority: "string",
          passport_code_authority: "string",
        },
        phone: "+91234567890",
        social_media: [
          {
            platform: "6363bba02ff1ca41d9a43d8c",
            url: "https://facebook.com/harry_potter",
            _id: "6363bd370e178b683d74ca1f",
          },
          {
            platform: "6380c37516af315ba265f682",
            url: "https://instagram.com/harry_potter",
            _id: "6380d4f414494a2161a8a387",
          },
          {
            platform: "6380c38e16af315ba265f684",
            url: "https://twitter.com/harry_potter",
            _id: "6380d4f414494a2161a8a388",
          },
          {
            platform: "6380c3a416af315ba265f686",
            url: "https://t.me/harry_potter",
            _id: "6380d4f414494a2161a8a389",
          },
        ],
        updated_by: "63749107da65643508dd891a",
        updated_on: "2022-11-25T20:15:08+05:30",
        payment_templates: [
          {
            platform: "6380aa2316af315ba265f679",
            platform_data: {
              paypal_id: "harrypotter@paypal.com",
            },
            _id: "6380d50314494a2161a8a3a8",
          },
          {
            platform: "6380aa7a16af315ba265f67c",
            platform_data: {
              paypal_id: "harrypotter@paypal.com",
              bank_name: "Neverland National Bank",
              account_holder: "Harry Potter",
              account_number: "1258964730",
              ifsc_code: "124578",
            },
            _id: "6380d51b14494a2161a8a3b4",
          },
          {
            platform: "638ee791e5ce3916c3843dc8",
            platform_data: {
              password: "R84AfxtQ",
              userName: "t780161868895-api"
            },
            _id: "638f47281332bb48d7f3a183"
          },
          {
            platform: "63ce5d94928564c4f59442d7",
            platform_data: {
              TerminalKey: "9b803edc1a09ebdd9ec94c0a3ce3a25339e0d41323c8429f0f39242ed360f6b8126611cf943873e83e0e4c95cde8b688d159738ce6273b3f4c668b6df7a16439686406903f28dd13695690456fa2caaaefb803c4943e0c7eb29f38d09a68272b3987ed2693b86d65e5886d79a2e641e021",
              Password: "cc1e780fe1d3971563da1e530d1d20ed64784a5952968ce3ca44e0e225b2f623df807ef00704c330fc74e6f0461a276af8176f480c2e5c271ad2474dfd6f620caad6119bc093364617ff88edb5b6ef91780a353d34432ff6916dc1b7cbba670945f94be9115eae17f836c484a45a531e",
              account_title: "Tinkoff Account"
            },
            _id: "63d7c98aadd826b09af79975"
          }
        ],
      },
    ])
      .then((res) => {
        console.log(`Seeding Successful`);
      });
  },

  down: (models, mongoose) => {
    return models.users.deleteMany({
      _id: {
        $in: [
          "63592f9e29fa6431e563fe02",
          "637490cfda65643508dd8914",
          "637490eeda65643508dd8916",
          "637490ffda65643508dd8918",
          "63749107da65643508dd891a",
        ],
      },
    }).then((res) => {
      console.log(`Rollback Successful`);
    });
  },
};
