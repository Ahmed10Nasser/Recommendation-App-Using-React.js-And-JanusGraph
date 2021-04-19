import { useState } from "react";

const Home = () => {

    const [category, setCategory]=useState(null);
    const [isChecked, setIsChecked]=useState(false);
    const [maxPrice, setMaxPrice]=useState(0);

    const [items,setItems]=useState(null);
    const [isPending, setIsPending]=useState(false);
    const [error, setError]=useState(null);

    const [similarItems,setSimilarItems]=useState(null);
    const [similarError, setSimilarError]=useState(null);

    const handleSubmit= (e)=>{
        e.preventDefault();

        const fetch = require('node-fetch');

        async function fetchData(query){
            setIsPending(true);
            setError(null);
            setItems(null);
            setSimilarItems(null);
            setSimilarError(null);
            try{
                const res=await fetch('http://localhost:8182/', {
                    method: "POST",
                    body: JSON.stringify({"gremlin": query}),
                });
                if(!res.ok){
                    throw Error('Can not fetch the required data');
                }
                else{
                    const obj= await res.json();
                    setItems(obj.result.data["@value"]);
                    setIsPending(false);
                    setError(null);
                }
            }
            catch(err){
                setItems(null);
                setIsPending(false);
                setError(err.message);
            }
        }
        let q=`g.V().hasLabel('${category}')${(isChecked)?'.has(\'price\',lte('+maxPrice+'))':''}.valueMap(true)`
        fetchData(q);
    }

    const handleGetSimilar=(id)=>{

        const fetch = require('node-fetch');

        async function fetchData(query){
            console.log("yaaaaaaa", id);
            setIsPending(true);
            setSimilarError(null);
            setSimilarItems(null);
            try{
                const res=await fetch('http://localhost:8182/', {
                    method: "POST",
                    body: JSON.stringify({"gremlin": query}),
                });
                if(!res.ok){
                    throw Error('Can not fetch the required data');
                }
                else{
                    const obj= await res.json();
                    setSimilarItems(obj.result.data["@value"]);
                    setIsPending(false);
                    setSimilarError(null);
                }
            }
            catch(err){
                setSimilarItems(null);
                setIsPending(false);
                setSimilarError(err.message);
            }
        }
        let q=`g.V(${id}).out('madeby').out('made')${(isChecked)?'.has(\'price\',lte('+maxPrice+'))':''}.valueMap(true)`;
        fetchData(q);
    }


    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="categorySelector">Choose your category</label>
                    <select className="form-control" name="category" id="categorySelector"
                        required
                        onChange={(e)=>{setCategory(e.target.value)}}
                    >
                        <option hidden value=""> -- Select a category --</option>
                        <option value="MobilePhone">Mobile Phone</option>
                        <option value="Laptop">Laptop</option>
                        <option value="Tablet">Tablet</option>
                        <option value="SmartWatch">Smart Watch</option>
                        <option value="SmartScreen">Smart Screen</option>
                    </select>
                </div>
                <div className="form-group m-4 custom-checkbox">
                    <input type="checkbox" className="form-check-input custom-control-input" id="IsRange" 
                        onChange={(e)=>setIsChecked(e.target.checked)}
                    />
                    <label htmlFor="IsRange" className="form-check-label custom-control-label">Apply maximum price</label>
                </div>
                {isChecked && (
                    <div className="form-group">
                        <label htmlFor="MaxPrice">Maximum Price</label>
                        <input className="form-control" type="number" name="maxPrice" id="MaxPrice" min="1"
                            required
                            onChange = {(e)=>setMaxPrice(e.target.value)}
                        />
                    </div>
                )}
                {!isPending && <button type="submit" className="btn btn-info text-white">Submit</button>}
                {isPending && (
                    <button className="btn btn-info text-white" type="button" disabled>
                        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                        Loading...
                    </button>
                )}
            </form>

            <div className="container my-3 result">
                {error && (
                    <div className="alert alert-info alert-dismissible fade show text-center" role="alert">
                        {error}. Try again.
                    </div>
                )}
                {items && items.length===0 && (
                    <div className="alert alert-info alert-dismissible fade show text-center" role="alert">
                        Sorry! There are no such items.
                    </div>
                )}

                {items && (
                    <div className="row">
                        {items.map((item)=>(
                            <div className="col-lg-4 col-md-6 my-2" key={item["@value"][1]["@value"]}>
                                <div className="card">
                                    <div className="card-header"></div>
                                    <div className="card-body">
                                        <h5 className="card-title">{item["@value"][7]["@value"][0]}</h5>
                                        <p className="class-text">Category: {item["@value"][3]}</p>
                                        <div className="d-flex justify-content-between">
                                            <button type="button" className="btn btn-outline-info"
                                                onClick={()=>handleGetSimilar(item["@value"][1]["@value"])}
                                            >Get Similar</button>
                                            <span className="bg-info p-2 rounded text-white">{item["@value"][5]["@value"][0]["@value"]}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <hr className="my-4"></hr>
            <div className="container my-3 similarResult">
                {(similarError || similarItems) && <h3 className="text-info mb-4">Similar Items</h3>}
                {similarError && (
                    <div className="alert alert-info alert-dismissible fade show text-center" role="alert">
                        {similarError}. Try again.
                    </div>
                )}
                {similarItems && similarItems.length===0 && (
                    <div className="alert alert-info alert-dismissible fade show text-center" role="alert">
                        Sorry! There are no such similar items.
                    </div>
                )}
                {similarItems && (
                    <div className="row">
                        {similarItems.map((item)=>(
                            <div className="col-lg-4 col-md-6 my-2" key={item["@value"][1]["@value"]}>
                                <div className="card">
                                    <div className="card-header">{item.company}</div>
                                    <div className="card-body">
                                        <h5 className="card-title">{item["@value"][7]["@value"][0]}</h5>
                                        <p className="class-text">Category: {item["@value"][3]}</p>
                                        <div className="d-flex flex-row-reverse">
                                            <span className="btn-info p-2 rounded">{item["@value"][5]["@value"][0]["@value"]}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
