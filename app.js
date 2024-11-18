const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const path = require("path")
const fs = require("fs")

const menuPath = path.join(__dirname, "mensajes", "menu.txt")
const menu = fs.readFileSync(menuPath, "utf8")


const flowHerramientas = addKeyword(EVENTS.ACTION)
    .addAnswer('*Perfecto aquí está el catálogo disponible con las herramientas que necesitas de acuerdo a tus necesidades*', {
        media: "https://live.staticflickr.com/65535/53997129397_98955dc48a_o.png",
    })
    .addAnswer("https://1drv.ms/b/c/011a2637b3ba4b76/ERyQrX9G4rhAhLvNFTHO6gwBQFgRYj8S86lrnM9UNOn71A?e=282386")
    .addAnswer("> Escribe *menú* nuevamente para elegir otra opción.")

const flowTutoriales = addKeyword(EVENTS.ACTION)
    .addAnswer('Ok, tengo para ti un canal dedicado donde aprenderás: a usar el chat y buscar las herramientas de IA según lo que necesites', {
        media: "https://live.staticflickr.com/65535/53998424000_d4bc1691b0_b.jpg",
    })
    .addAnswer("https://www.youtube.com/watch?v=O-mRPOuBJm8")
    .addAnswer("> Escribe *menú* nuevamente para elegir otra opción.")

const flowConsultas = addKeyword(EVENTS.ACTION)
    .addAnswer('Escríbeme o envia un audio tengo ojos 👀 y oídos 👂', {
        media: "https://live.staticflickr.com/65535/53998057548_016901581b_b.jpg",
    })

const Principal = addKeyword(EVENTS.WELCOME)
    .addAnswer('¿Estás un poco perdido? escribe "*menú*" para poder ayudarte', {
        media: "https://live.staticflickr.com/65535/53996943132_6ce2df4d40_o.png",
    })

const flowWelcome = addKeyword("Hola", "hey")
    .addAnswer('Hola soy champi, dime ¿en que puedo ayudarte? escribe "*menú*" para ver las diferentes opciones que te tengo', {
        media: "https://live.staticflickr.com/65535/53990649141_ca69b830c4_b.jpg",
    })

const flowWelcome2 = addKeyword("Hi", "Hello")
    .addAnswer("Hello, tell me how can I help you? 😎", {
        media: "https://live.staticflickr.com/65535/53991095800_c8b79f59cb_b.jpg"
    })

const flowWelcome3 = addKeyword("Ciao")
    .addAnswer("Ciao a tutti, come stai? mamma mía 🤌", {
        media: "https://live.staticflickr.com/65535/53991095795_53328e116d_b.jpg"
    })

const flowWelcome4 = addKeyword("Bonjour", "Bonjour champi")
    .addAnswer("Bonjour jeune créatif, ¿cómo estas el día de hoy? 🧐", {
        media: "https://live.staticflickr.com/65535/53991095790_bef6470e8a_b.jpg"
    })


const menuFlow = addKeyword(["menu", "opciones", "ayudame", "necesito ayuda", "necesito ideas"]).addAnswer(
    menu,
    { capture: true },
    async (ctx, { gotoFlow, fallBack, flowDynamic }) => {
        if (!["1", "2", "3", "0"].includes(ctx.body)) {
            return fallBack(
                "Respuesta no válida, selecciona una de las opciones"
            );
        }
        switch (ctx.body) {
            case "1":
                return gotoFlow(flowHerramientas);
            case "2":
                return gotoFlow(flowTutoriales);
            case "3":
                return gotoFlow(flowConsultas);
            case "0":
                return await flowDynamic(
                    "Puedes volver a acceder al menu principal escribiendo _*menú*_"
                );
        }
    }
);
const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([Principal,flowWelcome, flowWelcome2, flowWelcome3, flowWelcome4, flowHerramientas, flowTutoriales, flowConsultas, menuFlow])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
