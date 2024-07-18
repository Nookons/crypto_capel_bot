const dayjs = require('dayjs');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const {storage, db} = require("../../firebase");
const {doc, setDoc} = require("firebase/firestore");

const check_to_claim = async (bot, msg, userGlobalStates) => {


};

module.exports = {
    check_to_claim
};
