import React, {useEffect, useState} from 'react';
import './Main.css'
import {collection, query, where, onSnapshot} from "firebase/firestore";
import {db} from "../firebase";
import {Link, useNavigate} from "react-router-dom";
import {POST_PAGE_ROUTE} from "../utils/Routes";


const Main = () => {
    const [projectsData, setProjectsData] = useState([]);

    useEffect(() => {
        const path = query(collection(db, "projects"));

        const unsubscribe = onSnapshot(path, (querySnapshot) => {
            const projects = [];
            querySnapshot.forEach((doc) => {
                projects.push(doc.data());
            });
            setProjectsData(projects);
        });
    }, []);

    const onProjectClick = (link) => {
        window.location.href = link;
    }

    if (!projectsData.length) {
        return (
            <div className={"snackbar"}>

            </div>
        )
    }

    return (
        <div>
            <div style={{
                margin: "14px 0",
                display: "flex",
                flexWrap: "wrap",
                gap: 4
            }}>
                <button style={{padding: "2px 18px"}}><Link to={POST_PAGE_ROUTE}><article>POST</article></Link></button>
                <button style={{padding: "2px 18px"}}><Link to={POST_PAGE_ROUTE}><article>MINE</article></Link></button>
            </div>
            <div className={"Display"}>
                {projectsData.map((el, index) => {

                    return (
                        <div onClick={() => onProjectClick(el.link)}  key={index}>
                            <img alt={el.name} src={el.imgPath}/>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default Main;