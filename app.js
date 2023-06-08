const TelegramBot = require("node-telegram-bot-api");
const Calendar = require("telegram-inline-calendar");
const prisma = require("./prisma/client");
const moment = require("moment");

const {
    identifyUser,
    updateUserActivity,
    getUserActivity,
} = require("./prisma/util");
const { days } = require("./timeformater");

const token = "5991296312:AAG9S86KRA-Pn8601mKovxG1OkwIXBRGBys";
// Alur Pendafataran
const USER_ACTIVITY = {};

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });
const calendar = new Calendar(bot, {
    date_format: "DD-MM-YYYY",
    language: "en",
});

bot.on("message", async (msg) => {
    console.log("---------------- ⬇NEW MESSAGE⬇ ----------------");
    console.log(msg);
    const opts = {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
    };

    // JIKA USER MENGIRIM PESAN TANPA KONTEKS, PERIKAS AKTIVITAS TERKINI YANG DILAKUKAN USER
    const userActivity = await getUserActivity(msg);

    // JIKA AKTIVITAS TERAKHIR USER ADALAH "FILL_UP_PROFIL" MAKA LAKUKAN FUNGSI DIBAWAH
    if (userActivity === "FILL_UP_PROFIL") {
        const nim = msg.text;
        if (nim === null) {
            bot.sendMessage("Please give us the correct NIM", opts);
        }

        if (nim) {
            try {
                await prisma.user.create({
                    data: {
                        username:
                            msg.from?.username || `notidentify-${msg.chat.id}`,
                        last_name: msg.from?.last_name,
                        first_name: msg.from?.first_name,
                        user_chat_id: String(msg.chat.id),
                        nim: nim,
                    },
                });
                updateUserActivity(msg, "FINISH_FILL_UP_PROFIL");
                bot.sendMessage(
                    msg.chat.id,
                    "Yeayy 😎, We are already save your data 📝",
                    opts
                );
            } catch (error) {
                console.log(error);
            }
        }
    }

    // JIKA AKTIVITAS USER BERKAITAN ORDER BARANG
    if (userActivity?.startsWith("ORDER")) {
        // JIKA USER BARU MEMULAI ORDER
        if (userActivity === "ORDER") {
            console.log("USER STARTING ORDER");
        }
    }
});

bot.onText(/\/start/, async (msg) => {
    let options;
    let text;

    // START GIVE USER ID and TRACK ACTIVITY
    const userStatus = await identifyUser(msg);
    if (userStatus) {
        // Take user
        const user = await prisma.user.findUnique({
            where: {
                user_chat_id: String(msg.chat.id),
            },
        });

        options = {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [
                        { text: "Detail Profil", callback_data: "profil" },
                        { text: "Fill Up Profil", callback_data: "fillprofil" },
                    ],
                    [
                        {
                            text: "Inventory List",
                            callback_data: "inventorylist",
                        },
                        { text: "Order Good", callback_data: "peminjaman" },
                    ],
                    [{ text: "My Order", callback_data: "myorder" }],
                ],
            }),
        };

        // If User Empty Recomend User To Fill Up The Profil
        if (!user) {
            text =
                "Hello, you seem to have been here before, but we still don't really know you 🙄. You can choose the Fill Up Profile menu to complete your personal data 🤜🏽🤛🏽.";
        }

        // If User Already Have Profil, over them with other menu
        if (user) {
            text = `Welcome back ${
                user?.first_name || user?.last_name || user?.username
            }, to our Inventory Telegram bot! ✨\n
            We're glad to see you back and hope that our bot has been helping you manage your inventory efficiently.\n
            As a reminder you can use the list item menu to get a list of all the items you can borrow. The My Rent menu is a list of tools that you have borrowed or are currently borrowing.`;
        }
    }

    if (!userStatus) {
        options = {
            reply_markup: {
                resize_keyboard: true,
                one_time_keyboard: true,
                keyboard: [[{ text: "/command" }]],
            },
        };
        text = `Welcome to our Inventory Telegram bot! We're thrilled to have you on board. 
        Our bot is designed to help you manage your inventory and keep track of your stock levels. 
        With our easy-to-use interface and powerful features, you'll be able to manage your inventory with ease and efficiency.
        Here are some commands you can use
        \/command - For See All The Capability`;
    }
    bot.sendMessage(msg.chat.id, text, options);
});

bot.onText(/\/command/, (msg) => {
    var options = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [
                    { text: "Detail Profil", callback_data: "profil" },
                    { text: "Fill Up Profil", callback_data: "fillprofil" },
                ],
                [
                    { text: "Inventory List", callback_data: "inventorylist" },
                    { text: "Order Good", callback_data: "peminjaman" },
                ],
                [{ text: "My Rent Order", callback_data: "myorder" }],
            ],
        }),
    };
    const text =
        "Hallo Selamat Datang Di Sistem Inventori PNJ, Berikut menu-menu yang bisa anda pilih";
    bot.sendMessage(msg.chat.id, text, options);
});

bot.onText(/\/calender/, (msg) => {
    calendar.startNavCalendar(msg);
});

bot.on("callback_query", async (query) => {
    console.log("---------------- ⬇NEW CALLBACK⬇ ----------------");
    console.log(query);
    const action = query.data;
    const msg = query.message;
    const userChatId = msg.chat.id;

    const opts = {
        chat_id: userChatId,
        message_id: msg.message_id,
    };

    // Jika User Ingin Melihat Detail Profil Mereka
    if (action == "profil") {
        let text = "";
        const user = await prisma.user.findUnique({
            where: {
                user_chat_id: String(userChatId),
            },
        });
        if (user) {
            text = ` ⭐This Your Profile Detail⭐\nUsername:\t${user.username}\nName:\t${user.first_name} ${user.last_name}\nNIM:\t${user.nim}`;
        }

        if (!user) {
            text =
                "Sorry, we not recognize you. Are you new here? please fill up your profil first";
        }

        bot.editMessageText(text, opts);
    }

    // JIKA USER INGIN MELENGKAPI PROFIL MEREKA
    if (action == "fillprofil") {
        updateUserActivity(msg, "FILL_UP_PROFIL"); //Update aktifitas terakhir user, digunakan untuk menentukan respon berikutnya jika user mengirim pesan
        bot.editMessageText(
            "Please provide your NIM (ex: 1907421001)\n*just type your NIM",
            opts
        );
    }

    if (action === "inventorylist") {
        const data = await prisma.goods.findMany({
            orderBy: {
                name: "asc",
            },
        });

        const dataPlaceholder = [];
        data.forEach((item) => {
            dataPlaceholder.push([
                { text: item.name, callback_data: `order#${item.id}` },
            ]);
        });

        opts["reply_markup"] = JSON.stringify({
            inline_keyboard: dataPlaceholder,
        });
        bot.editMessageText("This Is the Item list", opts);
    }

    if (action.startsWith("order")) {
        const [_, id] = action.split("#");
        const data = await prisma.goods.findUnique({
            where: {
                id,
            },
        });
        const rent = await prisma.rent.create({
            data: {
                user: {
                    connect: {
                        user_chat_id: String(query.message.chat.id),
                    },
                },
                good: {
                    connect: {
                        id: data.id,
                    },
                },
            },
        });
        await updateUserActivity(
            query.message,
            `ORDER#SELECT_START_DATE#${rent.id}`
        );
        const now = new Date();
        now.setDate(1);
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        const text = `This The Goods Detail 📦\nName: ${data.name}\nQuantity:${data.quantity}`;
        const opts = {
            chat_id: query.message.chat.id,
            message_id: query.message.message_id,
        };
        opts["reply_markup"] = calendar.createNavigationKeyboard(now);
        bot.editMessageText(
            `You Are Select ${data.name}📦\nPlease select the start date of the rent 🗓️`,
            opts
        );
    }

    // JIKA USER MEMBERIKAN FEEDBACK/CALLBACK, PERIKAS AKTIVITAS TERKINI YANG DILAKUKAN USER
    const userActivity = await getUserActivity(msg);
    res = calendar.clickButtonCalendar(query);
    if (res !== -1) {
        // JIKA AKTIVITAS USER BERKAITAN ORDER BARANG
        if (userActivity?.startsWith("ORDER")) {
            // JIKA USER BARU MEMULAI ORDER DAN MEMILIH TANGGAL AWAL PEMINJAMAN
            if (userActivity.startsWith("ORDER#SELECT_START_DATE")) {
                const [type, date, id] = userActivity.split("#");

                console.log(res);
                // Memasukan Tanggal Awal Peminjaman Ke DB
                await prisma.rent.update({
                    where: {
                        id: String(id),
                    },
                    data: {
                        startRent: new Date(moment(res, "DD-MM-YYYY")),
                    },
                });

                const rent = await prisma.rent.findUnique({ where: { id } });
                // Mengubah Status Aktifitas User
                await updateUserActivity(
                    query.message,
                    `ORDER#SELECT_FINISH_DATE#${rent.id}`
                );

                // Memberi balasan, agar user memilih tanggal akhir peminjamannya
                const now = new Date();
                now.setDate(1);
                now.setHours(0);
                now.setMinutes(0);
                now.setSeconds(0);
                const opts = {
                    chat_id: query.message.chat.id,
                    message_id: query.message.message_id,
                    inline_message_id: query.id,
                };
                opts["reply_markup"] = calendar.createNavigationKeyboard(now);
                bot.sendMessage(
                    query.message.chat.id,
                    `Please select the date on which you want to end the rent 🗓️`,
                    opts
                );
            }

            // JIKA USER MEMILIH TANGGAL AKHIR PEMINJAMAN
            if (userActivity.startsWith("ORDER#SELECT_FINISH_DATE")) {
                const [type, date, id] = userActivity.split("#");

                // Memasukan Tanggal Awal Peminjaman Ke DB
                const updatedData = await prisma.rent.update({
                    where: {
                        id: String(id),
                    },
                    data: {
                        finishRent: new Date(moment(res, "DD-MM-YYYY")),
                    },
                    select: {
                        id: true,
                        startRent: true,
                        finishRent: true,
                        rentApprovalStatus: true,
                        loanStatus: true,
                        good: {
                            select: {
                                name: true,
                            },
                        },
                    },
                });

                // Mengubah Status Aktifitas User
                await updateUserActivity(
                    query.message,
                    `ORDER#FINISH_FILL_ORDER_FORM#${updatedData.id}`
                );
                // Memberi balasan, berupa summary peminjaman
                const summary = `The is a summary of your Rent\n🆔Your Order ID: ${
                    updatedData.id
                }\n📦 Goods Name: ${
                    updatedData.good[0].name
                }\n📅 Start Rent: ${days(
                    updatedData.startRent
                )}\n⏳ Finish Rent: ${days(
                    updatedData.finishRent
                )}\n📔 Approval Status: ${updatedData.rentApprovalStatus}`;

                bot.sendMessage(query.message.chat.id, summary);
            }
        }
    }

    // JIKA USER INGIN MELIHAT DAFTAR BARANG YANG DIA PINJAM
    if (action === "myorder") {
        const listOrder = await prisma.rent.findMany({
            where: {
                user: {
                    every: {
                        user_chat_id: String(query.message.chat.id),
                    },
                },
            },
            select: {
                id: true,
                startRent: true,
                finishRent: true,
                rentApprovalStatus: true,
                loanStatus: true,
                good: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        let summary = "The is list of your Rent\n";
        listOrder.forEach((order) => {
            summary += `---------------------------------------------------------
            \n🆔Your Order ID: ${order.id}\n📦 Goods Name: ${
                order.good[0].name
            }\n📅 Start Rent: ${days(order.startRent)}\n⏳ Finish Rent: ${days(
                order.finishRent
            )}\n📔 Approval Status: ${order.rentApprovalStatus}\n`;
        });
        bot.sendMessage(query.message.chat.id, summary);
    }
});
