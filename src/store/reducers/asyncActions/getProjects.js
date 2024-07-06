import {collection, doc, getDoc, onSnapshot, query} from "firebase/firestore";
import {db} from "../../../firebase";
import {fetchProjectsAction} from "../projectsReducer";

export const fetchProjects = () => {
    return async function(dispatch) {
        const path = query(collection(db, "projects"));

        const unsubscribe = onSnapshot(path, (querySnapshot) => {
            const projects = [];
            querySnapshot.forEach((doc) => {
                projects.push(doc.data());
            });

            dispatch(fetchProjectsAction(projects))
        });
    }
}