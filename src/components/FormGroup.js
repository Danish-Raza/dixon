import Utils from "../Utils";
import FormComponent from "./Form/FormComponent";
import _ from "underscore";
import Icon from "../Icon";
import { useEffect, useState } from "react";

function FormGroup(props) {
    const [config, setConfig] = useState(props.config);
    const {submit, width} = config;
    const [isDisabled, setIsDisabled] = useState({});
    const [formData, setFormData] = useState({});
    const sortOrder = _.keys(Utils.sortOrder(config._order));

    const validateForm = () => {
        let result = true;
        let modConfig = { ...config }
        _.map(sortOrder, wrapperOrder => {
            let components = _.keys(Utils.sortOrder(config[wrapperOrder]._order));
            _.map(components, rec => {
                let r = config[wrapperOrder][rec]
                if(r.type !== "button") {
                    modConfig = {
                        ...modConfig,
                        [wrapperOrder]: {
                            ...modConfig[wrapperOrder],
                            [rec]: {
                                ...modConfig[wrapperOrder][rec],
                                validated:(r.required) ? r.value !== undefined && r.value !== null && r.value !== "" ? true : false : true
                            }
                        }
                    }
                 if(result) {
                     result =  (r.required) ? r.value !== undefined && r.value !== null && r.value !== "" ? true : false : true
                 }
                } else if(r.type  ===  "button") {
                    modConfig = {
                        ...modConfig,
                        [wrapperOrder]: {
                            ...modConfig[wrapperOrder],
                            [rec]: {
                                ...modConfig[wrapperOrder][rec],
                                validated: true
                            }
                        }
                    }
                }
            })
        })
        setConfig(modConfig) 
        return result;
    }


    const submitHandler = () => {
        if(validateForm()) {
            let combinedData = {}
            let temObj = getFormData()
            _.map(temObj, (valObj, key) => {
                combinedData = { ...combinedData, ...valObj}
            })
            if(config.pass_data_on_submit) {
                props.onSubmit({[props.id]: combinedData})
            }
        }
    }

    const mockData = {
       "form_1": {
            "company_name": "Company name",
            "other_name":"Other name",
            "elit_network_id": "Elit network id",
            "corporate_website": "Corporate website",
            "elit_public_profile": "Elit public profile",
            "description":"Description"
       },
       "form_2": {
            "address_1":"Address 1",
            "address_2": "Address 2",
            "country": "country",
            "state":"state",
            "district":"district",
            "city":"city",
            "zipcode":"zipcode"
       },
       "form_3": {
            "product_category":"Product category",
            "service_category":"Service category",
            "industry_type":"Industry type",
            "industry_vertical":"Industry vertical",
            "Keyword":"Keyword",
            // "tin_no": "https://www.clickdimensions.com/links/TestPDFfile.pdf",
            // "company_logo": "https://www.gstatic.com/webp/gallery/1.jpg"
       }
    }

    const getFormData = (_config=config) => {
        let data = {}
        _.map(sortOrder, order => {
            data[order]={}
            let components = _.keys(Utils.sortOrder(_config[order]._order));
            _.map(components, rec => {
                if(_config[order][rec].type !== "button" && _config[order][rec].value !== undefined && _config[order][rec].value !== null && _config[order][rec].value !== ""  ) { 
                    data[order] = { ...data[order],  [rec]: _config[order][rec].value }
                }
             })
        })
        return data
    }

    useEffect(() => {
        let isDisabled = {};
        let modConfig = { ...config }
        _.map(sortOrder, order => {
            let components = _.keys(Utils.sortOrder(config[order]._order));
            _.map(components, rec => {
                let r = config[order][rec]
                if(r.type !== "button") {
                    modConfig = {
                        ...modConfig,
                        [order]: {
                            ...modConfig[order],
                            [rec]: {
                                ...modConfig[order][rec],
                                value: mockData[order] ? mockData[order][rec] : null
                            }
                        }
                    }
                }
             })
            isDisabled = {
                ...isDisabled,
                [order]: config[order].initial_disabled
            }
        })
        setConfig(modConfig)
        setIsDisabled(isDisabled)
    },[])

    const changeHandler = (params) => {
        const { key, value, id } = params;
        let modConfig = { ...config }
        let components = _.keys(Utils.sortOrder(config[id]._order));
        _.map(components, rec => {
            if(rec == key) {
                modConfig = {
                    ...modConfig,
                    [id]: {
                        ...modConfig[id],
                        [rec]: {
                            ...modConfig[id][rec],
                            value: value,
                            validated: true
                        }
                    }
                }
            }
        })
        setConfig(modConfig)
       
        if(config.pass_data_on_change) {
            let combinedData = {}
            let temObj = getFormData(modConfig)
            _.map(temObj, (valObj, key) => {
                combinedData = { ...combinedData, ...valObj}
            })
            props.onSubmit({[props.id]: combinedData})
        }
    }

    const handleIsDisabled = (id) => {
        let obj = {...isDisabled}
        obj[id] = !obj[id]
        setIsDisabled(obj)
    }

    return (
        <form className="form-group-wrapper"  onSubmit={submitHandler} style={{width: width || "100%" }} data-componentDontExist={props.componentDontExist}>
            {
                _.map(sortOrder, order => {
                    return (
                        <div className="form-wrapper" style={{width: config[order].width || "100%",  ...config[order].group_style && (config[order].group_style)}}>
                            {config[order].title !== undefined &&
                                <div className="form-wrapper-title" style={{marginBottom: config[order] && config[order]._order && _.isEmpty(config[order]._order) && 0}} >
                                    {config[order].title}
                                    {
                                        config[order].initial_disabled && (
                                            <div data-button-type="edit" onClick={() => handleIsDisabled(order)}>
                                                <Icon type="edit" width={17} height={17}/> Edit
                                            </div>
                                        )
                                    }
                                </div>
                            }
                            {config[order] && config[order]._order && !_.isEmpty(config[order]._order) && <FormComponent
                                config={{...config[order], title: null, on_change:true, width: "100%"}}
                                preFilledData={mockData[order]}
                                disabled={isDisabled[order]}
                                id={order}
                                onChange={changeHandler}
                            />}
                        </div>
                    )
                })
            }
            {submit && <button type="submit" button-type={"primary"} onClick={(e) => {e.preventDefault(); submitHandler()}}>{submit.display}</button>}
        </form>
    )
}
export default FormGroup