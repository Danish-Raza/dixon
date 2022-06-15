import { useState, useRef, useEffect } from "react";
import  _ from "underscore";
import Utils from "../Utils";
import Cards from "./Cards";
import Charts from "./Charts/Index";
import FormGroup from "./FormGroup";
import Overview from "./Overview";
import Table from "./Table/Index";

function Widgets(props) {
    const { config, curPage, curValue } = props;
    const [components, setComponents] = useState([])
    const [isEditable, setIsEditable] = useState(false)
    let [draggedItem,setDraggedItem] = useState(null)
    const widgetsWrapper = useRef();

    let _components = config && config._order ? _.keys(Utils.sortOrder(config._order)) : []
    // if(_components  && components.length==0) {
    //     setComponents(_components)
    // }
    

    useEffect(()  => {
        let _components = config && config._order ? _.keys(Utils.sortOrder(config._order)) : []
        setComponents(_components)
    },[])

    const handleDrop = (ev) => {
        let dragBoxIndex = null
        let dropBoxIndex = null
        let dragBox = null
        let dropBox =  null
        let field = null
        let detailPanelChildren = widgetsWrapper.current.children;
        for (let i = 0; i < detailPanelChildren.length; i++) {
            field = detailPanelChildren[i].getAttribute("data-field")
            if (detailPanelChildren[i].id === draggedItem) {
                let _componentsIndex =  _.findIndex(components, r => config[r].id==draggedItem)
                dragBoxIndex = _componentsIndex
                dragBox = _componentsIndex!=-1 ?  components[_componentsIndex]: null
            }
            if (detailPanelChildren[i].id === ev.currentTarget.id) {
                let _componentsIndex =  _.findIndex(components, r => config[r].id==ev.currentTarget.id)
                dropBoxIndex = _componentsIndex
                dropBox = _componentsIndex!=-1 ?  components[_componentsIndex]: null
            }
        }
        let modOrder =  [...components]
        if(dragBoxIndex != -1 && dropBoxIndex != -1 && dragBox) {
            modOrder.splice(dragBoxIndex, 1)
            modOrder.splice(dropBoxIndex, 0, dragBox )
            setComponents(modOrder)
            setDraggedItem(null)
        }
    }

    const handleDrag = (ev) => {
        setDraggedItem(ev.currentTarget.id);
    }

    const removeHandler = (id) => {
        let modOrder =  [...components]
        let i = _.findIndex(modOrder, r=> r == id)
        if(i!=-1) {
            modOrder.splice(i, 1)
            setComponents(modOrder)
        }
    }

    const toggleIsEditable = () => {
        setIsEditable(!isEditable)
    }
    return (
        <div
            className="widgets-wrapper"  
            ref={widgetsWrapper}
            onDragOver={(event) => {
                event.stopPropagation();
                event.preventDefault();
            }}
        >
            {
                _.map(components, component => {
                    let type = config[component].type
                    switch (type) {
                        case "overview":
                            return <Overview 
                            toggleIsEditable={toggleIsEditable} 
                            isEditable={isEditable} 
                            config={config[component]} 
                            handleDrop={handleDrop} 
                            handleDrag={handleDrag} />
                        case "card":
                            return <Cards
                            removeHandler={removeHandler} 
                            isEditable={isEditable} 
                            config={config[component]} 
                            handleDrop={handleDrop} 
                            handleDrag={handleDrag}/>
                        case "chart":
                            return <Charts 
                            removeHandler={removeHandler} 
                            isEditable={isEditable} 
                            config={config[component]} 
                            handleDrop={handleDrop} 
                            handleDrag={handleDrag}/>
                        case "table":
                            return <Table  
                            removeHandler={removeHandler} 
                            isEditable={isEditable} 
                            config={config[component]} 
                            handleDrop={handleDrop} 
                            handleDrag={handleDrag}/>
                        case "form-group":
                            return <FormGroup
                            isEditable={isEditable} 
                            config={config[component]} 
                            handleDrop={handleDrop} 
                            handleDrag={handleDrag}
                            removeHandler={removeHandler} 
                            />
                        default:
                            break;
                    }
                })
            }
        </div>
    )
}
export default Widgets