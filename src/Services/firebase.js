import firebase from 'firebase'

const FirebaseConfig = {
  apiKey: "AIzaSyBvjtpVg6G4zNcWaMDxw3uAlLwD8SWAWqc",
  authDomain: "burntcontent.firebaseapp.com",
  databaseURL: "https://burntcontent.firebaseio.com",
  projectId: "burntcontent",
  storageBucket: "burntcontent.appspot.com",
  messagingSenderId: "359672956176"
};
firebase.initializeApp(FirebaseConfig);

const databaseRef = firebase.database().ref();
export const contentRef = databaseRef.child("testing");


export const monitorContent = (newTodosCallback) => {
  contentRef
    .child("content")
    .on("value", snapshot => {

      var values = [];
      snapshot.forEach(function(childSnapshot) {
        let lastEditor = "unknown";

          if (childSnapshot.event ===  "child_removed") {
              newTodosCallback({ locked: false });
              return
          }
          var childKey = childSnapshot.key;
          var childData = childSnapshot.val();

          values.push({key: childKey, lastEdit: childData.lastEdit, text: childData.text, lastEditor: lastEditor })
      });
      newTodosCallback(values);
    });

    contentRef
      .child("content")
      .on("child_removed", snapshot => {
        console.log("child_removed");
        newTodosCallback([{event: "child_removed"}]);
      });
};

export const unmonitorContent = () => {
  contentRef
    .child("content")
    .off()
}

export const setContent = (key, text) => {
  if (key === null || key === undefined ) {
    console.log("cannot update content: " + key);
    return;
  }
  if ( text !== null && text !== undefined) {
    console.log("adding/updating: " + key);
    contentRef
      .child("content")
     .child(key)
     .set({ "text": text, "lastEdit": Date.now() });
   } else {
   console.log("removing: " + key);
   contentRef
     .child("content")
     .child(key)
     .remove();
   }
};
