import React, {useEffect, useState} from 'react';
import './Main.css'
import {collection, query, where, onSnapshot} from "firebase/firestore";
import {Link, useNavigate} from "react-router-dom";
import {POST_PAGE_ROUTE} from "../utils/Routes";
import {db} from "../firebase";


const Main = () => {
    const [projectsData, setProjectsData] = useState([]);
    const [dialogItem, setDialogItem] = useState();

    const [isDialog, setIsDialog] = useState({
        isOpen: false,
        id: 0,
    });

    useEffect(() => {
        if (isDialog.id) {
            const founded = projectsData.find(item => item.id === isDialog.id)
            setDialogItem(founded);
        }
    }, [isDialog]);

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
                <button className={"Buttons"}> <Link to={POST_PAGE_ROUTE}><article>POST</article></Link></button>
                <button className={"Buttons"}> <Link to={POST_PAGE_ROUTE}><article>MINE</article></Link></button>
            </div>
            {isDialog.isOpen &&
                <div onClick={() => setIsDialog((prevState) => ({...prevState, isOpen: false, id: 0}))} className={"Dialog"}>
                    <div onClick={(el) => el.stopPropagation()}>
                        <img style={{maxWidth: "100%"}} alt={dialogItem?.name} src={dialogItem?.imgPath}/>
                        <h4>{dialogItem?.name}</h4>
                        <p>{dialogItem?.description}</p>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                            marginTop: 14
                        }}>
                            <button onClick={() => onProjectClick(dialogItem.link)} className={"Buttons"}> <article>Launch</article></button>
                            <button className={"Buttons"}> <article>Add to favorite</article></button>
                        </div>
                    </div>
                </div>
            }
            <div className={"Display"}>
                {projectsData.map((el, index) => {

                    return (
                        <div
                            style={{
                                background: `url(${el.imgPath})`
                            }}
                            onClick={() => setIsDialog((prevState) => ({...prevState, isOpen: true, id: el.id}))}
                            key={index}
                        >
                            {/*<img alt={el.name} src={el.imgPath}/>*/}
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default Main;