const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const app = express();

const port = 8000;

const cors = require('cors');

app.use(cors());

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(passport.initialize());

const jwt = require('jsonwebtoken');

mongoose
    .connect('mongodb+srv://Mukul:Mukul25@cluster0.8o6oxmw.mongodb.net/', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() =>
    {
        console.log('Connected to MongoDB');
    })
    .catch((err) =>
    {
        console.log('error connecting to mongodb', err);
    });

app.listen(port, "192.168.1.36", () =>
{
    console.log('Server is running on port http://192.168.1.36');
});


const User = require("./models/user");
const Message = require("./models/message");


app.post("/register", async (req, res) =>
{

    try
    {
        const { name, email, password, image } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser)
        {
            return res.status(400).json({
                message: "Email Already Registered",
            });
        }

        //create a new user

        const newUser = new User({ name, email, password, image });

        //generate and store the verification Token

        newUser.verificationToken = crypto.randomBytes(20).toString('hex');

        // save the user to database

        await newUser.save();

        //send the verification email to the user

        sendVerificationEmail(newUser.email, newUser.verificationToken);

        res.status(200).json({
            message: "Registration Successful",
        })

    } catch (error)
    {
        console.log('error registering user', error);
        res.status(500).json({
            message: 'Error Registering user',
        });
    }

});

const sendVerificationEmail = async (email, verificationToken) =>
{
    //create a nodemailer transporter

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "mrsgaming2506@gmail.com",
            pass: "fohm lerv ihgs zutw",
        },
    });

    //compose the email message 

    const mailOptions = {
        from: "Fitness-Partner.com",
        to: email,
        subject: "Email Verification",
        text: `Please click the following link to verify your email http://192.168.1.34:8000/verify/${verificationToken}`,

    };

    try
    {

        await transporter.sendMail(mailOptions);

    } catch (error)
    {
        console.log("error sending email", error);
    }

};

app.get("/verify/:token", async (req, res) =>
{

    try
    {

        const token = req.params.token;

        const user = await User.findOne({ verificationToken: token });

        if (!user)
        {
            return res.status(404).json({
                message: "invalid token",
            });
        }

        user.verified = true;
        user.verificationToken = undefined;
        await user.save();

        res.status(200).json({
            message: "Email Verified successfully",
        });

    } catch (error)
    {
        console.log("error getting token", error);
    }


});


const generateSecretKey = () =>
{
    const secretKey = crypto.randomBytes(32).toString("hex");
    return secretKey;
};

const secretKey = generateSecretKey();


app.post("/login", async (req, res) =>
{
    try
    {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user)
        {
            return res.status(404).json({
                message: "Invalid Email",
            });
        }

        if (user.password !== password)
        {
            return res.status(404).json({
                message: "Invalid password",
            });
        }

        const token = jwt.sign({ userId: user._id }, secretKey);
        res.status(200).json({ token });

    } catch (error)
    {
        res.status(500).json({ message: "Login Failed" });
    }
});


//endpoint to access all the users except the user who's is currently Logged IN

app.get("/users/:userId", (req, res) =>
{
    const loggedInUserId = req.params.userId;

    User.find({ _id: { $ne: loggedInUserId } }).then((users) =>
    {
        res.status(200).json(users);
    }).catch((error) =>
    {
        console.log("error Retriving users", error);

        res.status(500).json({
            message: "error Retriving Users",
        });

    });



});


//endpoint to send a request to a user
app.post("/friend-request", async (req, res) =>
{
    const { currentUserId, selectedUserId } = req.body;

    try
    {
        //update the recepient's friendRequestsArray!
        await User.findByIdAndUpdate(selectedUserId, {
            $push: { freindRequests: currentUserId },
        });

        //update the sender's sentFriendRequests array
        await User.findByIdAndUpdate(currentUserId, {
            $push: { sentFriendRequests: selectedUserId },
        });

        res.sendStatus(200);
    } catch (error)
    {
        res.sendStatus(500);
    }
});

//endpoint to show all the friend-requests of a particular user
app.get("/friend-request/:userId", async (req, res) =>
{
    try
    {
        const { userId } = req.params;

        //fetch the user document based on the User id
        const user = await User.findById(userId)
            .populate("freindRequests", "name email image")
            .lean();

        const freindRequests = user.freindRequests;

        res.json(freindRequests);
    } catch (error)
    {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

//endpoint to accept a friend-request of a particular person
app.post("/friend-request/accept", async (req, res) =>
{
    try
    {
        const { senderId, recepientId } = req.body;

        //retrieve the documents of sender and the recipient
        const sender = await User.findById(senderId);
        const recepient = await User.findById(recepientId);

        sender.friends.push(recepientId);
        recepient.friends.push(senderId);

        recepient.freindRequests = recepient.freindRequests.filter(
            (request) => request.toString() !== senderId.toString()
        );

        sender.sentFriendRequests = sender.sentFriendRequests.filter(
            (request) => request.toString() !== recepientId.toString
        );

        await sender.save();
        await recepient.save();

        res.status(200).json({ message: "Friend Request accepted successfully" });
    } catch (error)
    {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

//endpoint to access all the friends of the logged in user!
app.get("/accepted-friends/:userId", async (req, res) =>
{
    try
    {
        const { userId } = req.params;
        const user = await User.findById(userId).populate(
            "friends",
            "name email image"
        );
        const acceptedFriends = user.friends;
        res.json(acceptedFriends);
    } catch (error)
    {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


const multer = require("multer");

// Configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb)
    {
        cb(null, "files/"); // Specify the desired destination folder
    },
    filename: function (req, file, cb)
    {
        // Generate a unique filename for the uploaded file
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

//endpoint to post Messages and store it in the backend
app.post("/messages", upload.single("imageFile"), async (req, res) =>
{
    try
    {
        const { senderId, recepientId, messageType, messageText } = req.body;

        const newMessage = new Message({
            senderId,
            recepientId,
            messageType,
            message: messageText,
            timestamp: new Date(),
            imageUrl: messageType === "image" ? req.file.path : null,
        });

        await newMessage.save();
        res.status(200).json({ message: "Message sent Successfully" });
    } catch (error)
    {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

///endpoint to get the userDetails to design the chat Room header
app.get("/user/:userId", async (req, res) =>
{
    try
    {
        const { userId } = req.params;

        //fetch the user data from the user ID
        const recepientId = await User.findById(userId);

        res.json(recepientId);
    } catch (error)
    {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//endpoint to fetch the messages between two users in the chatRoom
app.get("/messages/:senderId/:recepientId", async (req, res) =>
{
    try
    {
        const { senderId, recepientId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: senderId, recepientId: recepientId },
                { senderId: recepientId, recepientId: senderId },
            ],
        }).populate("senderId", "_id name");

        res.json(messages);
    } catch (error)
    {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});




app.get("/friend-requests/sent/:userId", async (req, res) =>
{
    try
    {
        const { userId } = req.params;
        const user = await User.findById(userId).populate("sentFriendRequests", "name email image").lean();

        const sentFriendRequests = user.sentFriendRequests;

        res.json(sentFriendRequests);
    } catch (error)
    {
        console.log("error", error);
        res.status(500).json({ error: "Internal Server" });
    }
})

app.get("/friends/:userId", (req, res) =>
{
    try
    {
        const { userId } = req.params;

        User.findById(userId).populate("friends").then((user) =>
        {
            if (!user)
            {
                return res.status(404).json({ message: "User not found" })
            }

            const friendIds = user.friends.map((friend) => friend._id);

            res.status(200).json(friendIds);
        })
    } catch (error)
    {
        console.log("error", error);
        res.status(500).json({ message: "internal server error" })
    }
})
