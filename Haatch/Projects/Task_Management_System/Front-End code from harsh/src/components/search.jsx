import search from '../assets/icons/search.svg'
const Search=(data,setData)=>{
    const handleChange=(e)=>{
        setData(e.target.value);
    }
    return(<div className="d-flex align-items-center w-25 border-black p-0 h-48 p-1">
        <img className='h-2' src={search} alt="search" />
        <input className='border-0 w-100 input-field' onChange={handleChange} placeholder='search...' type="text"/>
    </div>)
}

export default Search;