import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
//import UserExisting from "../Components/UserExist";
var config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};


export const server = firebase.initializeApp(config);
export const storage = firebase.storage();
export const database = firebase.database().ref('/posts');
export let currentUser;

export function UserAuthState(callback) {
  var user = server.auth().currentUser;
  //console.log("in fire user = ", user);
  callback(user);
}

let appData;

const INIT_WAIT_TIME = 1000;
let initTimerID;

/**
 * Check if the user session is available.
 *
 * @param {Function} callback
 */
export function checkUser(callback) {
  var user = JSON.parse(sessionStorage.getItem("authUser"));
  //console.log("user", user);
  // server.auth().onAuthStateChanged(user => {
  if (user) {
    //make changes

    // console.log("Logged-in user is verified");
    // if(user.emailVerified)
    currentUser = user;
    callback(currentUser);
  } else {
    currentUser = null;
    callback(currentUser);
    //  console.log("No logged-in user");
  }
  // });
}

/**
 * Login to Firebase application.
 *
 * @param {String} userid
 * @param {String} password
 * @param {Function} loginHandler
 */
export function login(userid, password, loginHandler) {
  var UserEmail;

  server
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(function () {
      server
        .auth()
        .signInWithEmailAndPassword(userid, password)
        .then(function (result) {
          // console.log("result = ", result);
          // console.log("result user: ", result.user);
          if (!result.user.emailVerified) {
            // console.log("email not verified");
            // let error1 = {};
            // error1 = { code: "email-not-verified" };

            // // logout(e => {
            // loginHandler(false, error1);
            // });

            // sessionStorage.setItem("authUser", JSON.stringify(result.user));

            //sessionStorage.removeItem("authUser");
            let error1 = {};
            error1 = { code: "email-not-verified" };

            loginHandler(false, error1);
          }
          //sessionStorage.removeItem("authUser");
          else {
            // sessionStorage.removeItem("authUser");

            sessionStorage.setItem("authUser", JSON.stringify(result.user));
            loginHandler(true, result);
          }
        })
        .catch(function (error) {
          // Handle Errors here.
          // var errorCode = error.code;
          // var errorMessage = error.message;
          // alert(errorMessage);

          if (!error.code) {
            login(userid, password, loginHandler);
          } else {
            // console.log("error in catch", error.code);
            loginHandler(false, error);
          }
        });
    })
    .catch(function (error) {
      loginHandler(false, error);
    });
}

export function emailVerificationLink() {
  server
    .auth()
    .currentUser.sendEmailVerification()
    .then(function () {
      alert(
        "An e-mail verification link has been sent to " +
        server.auth().currentUser.email +
        " Please verify from your email account."
      );
    })
    .catch(function (error) {
      alert("Error! Email verification link could not be sent");
    });
}

export function registerUser(userName, email, password, callback) {
  server
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(function (user) {
      server
        .database()
        .ref("/RegisteredData/" + server.auth().currentUser.uid)
        .set({
          userName: userName,
          emailid: email,
        });

      server
        .auth()
        .currentUser.sendEmailVerification()
        .then(function () {
          // Email sent.
          alert(
            "An e-mail verification link has been sent to " +
            email +
            ". Please verify from your email account."
          );
          callback(true);
        })
        .catch(function (error) {
          // email not sent
          alert("Error! Email verification link could not be sent");
          callback(false, error);
        });
    })
    .catch(function (error) {
      // user not created
      callback(false, error);
    });
}

export function forgotPassword(email, callback) {
  server
    .auth()
    .sendPasswordResetEmail(email)
    .then(function () {
      console.log(
        " Password reset confirmation sent. Ask user to check their email"
      );
      callback(true);
    })
    .catch(function (error) {
      console.log("Error encountered while sending password reset code");
      callback(false);
    });
}
/**
 * Change password of the current logged-in user.
 *
 * @param {String} newPassword
 * @param {Function} callback
 */

function reauthenticate(currentPassword, callback) {
  var user = server.auth().currentUser;
  // console.log("in reauthenticate user = ", user);
  if (user) {
    var cred = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    user
      .reauthenticateAndRetrieveDataWithCredential(cred)
      .then(() => {
        // console.log("current password authenticated");
        callback(true);
      })
      .catch(error => {
        // console.log(error);
        callback(false, error);
      });
  }
}

export function changePassword(currentPassword, newPassword, callback) {
  reauthenticate(currentPassword, (success, e) => {
    if (success) {
      var user = server.auth().currentUser;
      if (user) {
        user
          .updatePassword(newPassword)
          .then(() => {
            // console.log("Password updated!");
            callback(true);
          })
          .catch(error => {
            console.log(error);
            callback(false, error);
          });
      }
    } else {
      callback(false, e);
    }
  });
}

/**
 * Logout current user session.
 */
export function logout(callback) {
  server
    .auth()
    .signOut()
    .then(() => {
      sessionStorage.removeItem("authUser");
      callback(true);
    });
}

/**
 * Load the data from server and start monitoring them.
 *
 * @param {Function} callback
 */
export function init(callback) {
  if (currentUser) {
    if (appData) {
      // console.log("Data is available.");
      callback(true);
    } else {
      // console.log("No data. Starting timer.");
      // wait for a second to initialize the data
      initTimerID = window.setTimeout(() => {
        if (appData) {
          // console.log("Data available.");
          callback(true);
        } else {
          // console.log("Still no data.");
          callback(false);
        }

        window.clearTimeout(initTimerID);
        initTimerID = null;
      }, INIT_WAIT_TIME);
    }
  }
}

export function loadData(callback) {
  var usersRef = server.database().ref("Post");
  //const user = server.auth().currentUser;
  usersRef.child(currentUser.uid).on("value", snapshot => {
    var exists = snapshot.val() !== null;
    // console.log("fire exists = ", exists);
    callback(exists);
  });
}
