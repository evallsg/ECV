var Database = function() {

}

Database.prototype.init = function() {
    this.admin = require("firebase-admin");
    var serviceAccount = require("./firebase.json");

    this.admin.initializeApp({
        credential: this.admin.credential.cert(serviceAccount),
        databaseURL: "https://ecv-p3.firebaseio.com"
    });

    this.db = this.admin.database();
}


Database.prototype.register = function(data) {

    this.admin.auth().createUser({
            email: data.email,
            password: data.password,
            displayName: data.name,
            disabled: false,
            photoUrl: data.avatar
        })
        .then(function(userRecord) {
            // See the UserRecord reference doc for the contents of userRecord.
            console.log("Successfully created new user:", userRecord.uid);
        })
        .catch(function(error) {
            console.log("Error creating new user:", error);
        });
}
Database.prototype.editUser = function(uid, data) {
    this.admin.auth().updateUser(uid, data)
        .then(function(userRecord) {
            // See the UserRecord reference doc for the contents of userRecord.
            console.log("Successfully updated user", userRecord.toJSON());
        })
        .catch(function(error) {
            console.log("Error updating user:", error);
        });
}

Database.prototype.deleteUser = function(uid) {
    this.admin.auth().deleteUser(uid)
        .then(function() {
            console.log("Successfully deleted user");
        })
        .catch(function(error) {
            console.log("Error deleting user:", error);
        });
}
Database.prototype.geAllBooks = function() {

    var ref = this.db.ref("books");
    ref.on("value", function(book) {
        console.log(book.val());
        return book.val();
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
        return null;
    });
}
Database.prototype.addBook = function(data) {
    var ref = this.db.ref("books").push();
    data.bookId = ref.key
    ref.set({
            title: data.title,
            owner_id: data.userId,
            genre: data.genre,
            finished: false,
        }).then(function() {
            console.log("Successfully added book: ", data.bookId);
        })
        .catch(function(error) {
            console.log("Error adding book: ", error);
        });
}

Database.prototype.getBook = function(uid) {

    var ref = this.db.ref("books/" + uid);
    ref.on("value", function(book) {
        console.log(book.val());
        return book.val();
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
        return null;
    });
}

Database.prototype.addChapter = function(data) {
    var ref = this.db.ref("chapters/" + data.bookId).push();
    var that = this;
    data.id = ref.key;
    ref.set({
            parent_id: data.parentId != undefined ? data.parentId : null,
            title: "",
            decision: data.decision != undefined ? data.decision : null,
            text: "",
            owner_id: data.userId,
            finished: false,
            is_terminal: false
        }).then(function() {
            if (data.parentId != null) {
                var ref = that.admin.database().ref("chapters/" + data.bookId + "/" + data.parentId + "/children/" + data.id)
                ref.set({
                    decision: data.decision
                });
            }
        })
        .catch(function(error) {
            console.log("Error adding chapter:", error);
        });
}
Database.prototype.getChapter = function(bookId, chapterId) {

    var ref = this.db.ref("chapterS/" + bookId + "/" + chapterId);
    ref.on("value", function(chapter) {
        console.log(chapter.val());
        return chapter.val();
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
        return null;
    });
}
Database.prototype.getBookChapters = function(bookId) {

    var ref = this.db.ref("chapterS/" + bookId);
    ref.on("value", function(chapters) {
        console.log(chapters.val());
        return chapters.val();
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
        return null;
    });
}
/*Database.prototype.updateChapters = function(data){
  var updates = {};
  updates['/posts/' + newPostKey] = postData;
  updates['/user-posts/' + uid + '/' + newPostKey] = postData;
  return firebase.database().ref().update(updates);
}*/
/*var Database = new Database();
Database.init()*/
module.exports = Database;