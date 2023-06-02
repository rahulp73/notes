import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faPlus,faBars, faXmark, faNoteSticky, faTrashCan, faUser, faArrowRightFromBracket, faGreaterThan, faTrashCanArrowUp} from "@fortawesome/free-solid-svg-icons";
import './App.css';
import { useState,useEffect, useRef } from 'react';
import GoogleLogo from './Google-logo.png';

function App() {

  // UseStates
  const [searchValue, setSearchValue] = useState("");
  const [takeANoteValue, setTakeANoteValue] = useState("")
  const [toggle, setToggle] = useState(true)
  const [Notes,setNotes] = useState([])
  const [DeletedNotes,setDeletedNotes] = useState([])
  const [ModalState,setModelState] = useState(false)
  const [ModalText,setModalText] = useState('')
  const [ModalID,setModalID] = useState('')
  const [Tabs, setTabs] = useState(true)
  const [ProfileState, setProfileState] = useState(false)
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [state, setState] = useState(true)
  const [loginState, setLoginState] = useState(true)
  const [userId, setUserId] = useState()

  //useRef
  const intialRender = useRef(true)

  const getNotes = () => {
    console.log({"id" : userId})
    fetch('http://localhost:8080/notes',{
      method : 'post',
      body : JSON.stringify({"id" : userId}),
      headers : {
        'Content-Type' : 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
      setNotes(data)
      console.log(data)
    })
  }
  const getDeletedNotes = () => {
    fetch('http://localhost:8080/deletedNotes',{
      method : 'post',
      body : JSON.stringify({"id" : userId}),
      headers : {
        'Content-Type' : 'application/json'
      }
    })
    .then(res => res.json())
    .then(deldata => {
      setDeletedNotes(deldata)
      console.log(deldata)
    })
  }
  const postNote = () => {
    fetch('http://localhost:8080/newNote', {
      method: 'post',
      body : JSON.stringify({"userId": userId ,"note" : (takeANoteValue)}),
      headers : {
        'Content-Type' : 'application/json'
      }
    }).then(res=>res.json()).then(data => {
      setNotes(data)
      setTakeANoteValue('')
      console.log(data + "PostNotes")
    })
  }
  const deleteNote = (ID) => {
    console.log(ID + ' Delete')
    fetch('http://localhost:8080/deleteNote', {
      method : 'delete',
      body : JSON.stringify({id : (ID)}),
      headers : {
        'Content-Type' : 'application/json'
      }
    }).then(res => {
      if(res.status===200){
        getNotes()
        console.log('Get Notes Called')
        getDeletedNotes()
        console.log('Get Deleted Notes Called')
      }
    })
  }
  const trashNote = (ID) => {
    console.log(ID + ' Delete')
    fetch('http://localhost:8080/trashNote', {
      method : 'delete',
      body : JSON.stringify({id : (ID)}),
      headers : {
        'Content-Type' : 'application/json'
      }
    }).then(res => {
      if(res.status===200){
        getDeletedNotes()
      }
    })
  }
  const restoreNote = (ID) => {
    console.log(ID + "Restore")
    fetch('http://localhost:8080/restoreNote', {
      method : 'post',
      body : JSON.stringify({id : (ID)}),
      headers : {
        'Content-Type' : 'application/json'
      }
    }).then(res => {
      if(res.status===200){
        getDeletedNotes()
        getNotes()
      }
    })
  }
  const updateNote = () => {
    fetch('http://localhost:8080/updateNote',{
      method: 'put',
      body : JSON.stringify({
        id : ModalID,
        note : ModalText
      }),
      headers : {
        'Content-Type' : 'application/json'
      }
    }).then(res => res.json()).then(data => setNotes(data))
  }
  const handleSignInSubmit = () =>{
    if(username.length>0 && password.length>0){
      const data = {
        userName : username,
        password : password
      }
      fetch('http://localhost:8080/signin',{
        method : 'post',
        body: JSON.stringify(data),
        headers:{
          'Content-Type' : 'application/json'
        }
      }).then(res => res.json()).then(data => {
        if(data.status === 200){
          setUserId(data.body)
          setName(data.name)
          intialRender.current = false
          setLoginState(false)
        } else {
          console.log('Sign In Failed')
        }
      })
    }
  }
  const handleSignUpSubmit = () =>{
    if(username.length>0 && name.length>0 && password.length>0){
      const data = {
        userName : username,
        name : name,
        password : password
      }
      fetch('http://localhost:8080/signup',{
        method : 'post',
        body : JSON.stringify(data),
        headers : {
          'Content-Type' : 'application/json'
        }
      }).then(res => res.json()).then(data => {
        if(data.status == 200){
          setUserId(data.body.insertedId)
          intialRender.current = false
          setLoginState(false)
        } else {
          console.log('Sign Up Failed')
        }
      })
    }
  }

  // UseEffect
  useEffect (()=>{
    if(intialRender.current){
      intialRender.current = true
    } else{
      getNotes()
      getDeletedNotes()
    }
  },[loginState])
  useEffect(() => {
      const close = (e) => {
        if(e.key === 'Escape'){
          falseModalState()
        }
      }
      window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  },[])

  //Changing Values Function
  const searchChange = (event) => {
    setSearchValue(event.target.value);
  }
  const takeANoteValueChange = (event) => {
    setTakeANoteValue(event.target.value)
  }
  const toggleClass = () => {
    setToggle(!toggle)
  }
  const falseModalState = ()=>{
    setModelState(false)
    updateNote()
  }
  const trueModalState = (event,ID) =>{
    setModalID(ID)
    setModelState(true)
    setModalText(event.target.textContent)
  }
  const ModalTextChange = (event) => {
    setModalText(event.target.textContent)
  }

  // Clearing Functions
  const clearFunction = () => {
    setSearchValue("");
  }
  const clearTakeANoteValue =  () => {
    setTakeANoteValue("")
  }
  const filteringNotes = (Note) => {
    if(Note.note.toLowerCase().includes(searchValue.toLowerCase())){
      return Note
    }
  }
  const searchedNotes = Notes.filter(filteringNotes)

  return (
    <div className="App">
      <nav className='NavBar'>
        <div className='HamBurger Clickable' onClick={toggleClass}><FontAwesomeIcon icon={ faBars } /></div>
        <div className='DisplayPicture'>DisplayPicture</div>
        <div className='SearchBar'>
          <div className='SearchIcon Clickable'><FontAwesomeIcon icon={ faMagnifyingGlass } /></div>
          <input type='text' placeholder='Search' className='TextField' value={searchValue} onChange={ searchChange }></input>
          <div className='TextClear Clickable' onClick={ clearFunction }><FontAwesomeIcon icon={ faXmark } /></div>
        </div>
        <div className="Hud">
          <div className="ProfilePic" onClick={() => setProfileState(!ProfileState)}><img src="https://uploads.turbologo.com/uploads/design/hq_preview_image/5097676/draw_svg20210617-26747-23281c.svg.png" alt="Google"/></div>
        </div>
        <div className={`sub-menu-wrap ${ProfileState? 'sub-menu-wrap-400' : 'sub-menu-wrap-zero'}`}>
          <div className='sub-menu'>
            <div className='user-info'>
              <img src='https://uploads.turbologo.com/uploads/design/hq_preview_image/5097676/draw_svg20210617-26747-23281c.svg.png' alt="ProfilePic"/>
              <h2>{name}</h2>
            </div>
            <hr/>
            <a href="#" className="sub-menu-link">
              <div><FontAwesomeIcon icon={faUser} /></div>
              <p>Edit Profile</p>
              <span><FontAwesomeIcon icon={faGreaterThan}/></span>
            </a>
            <a href="#" className="sub-menu-link">
              <div><FontAwesomeIcon icon={faArrowRightFromBracket} /></div>
              <p>Log Out</p>
              <span><FontAwesomeIcon icon={faGreaterThan}/></span>
            </a>

          </div>
        </div>
      </nav>
      {!loginState && <><div className="LowerHalf">
        <div className={`Tabs-${toggle? "active" : "notActive"}`}>
          <div className={`${toggle? 'TabsNotes' : 'TabsNotes-notActive'} ${toggle? 'TabsRound' : ''} ${Tabs? 'TabsActive' : ''}`} onClick={() => setTabs(true)}>
            <div className={`TabsNotesSticky ${toggle? '' : 'TabsCircle'}`}><FontAwesomeIcon icon={ faNoteSticky } /></div>
            <div className='TabsNotesStickyText' style={{display : `${toggle? 'inline-flex' : 'none' }`}}>Notes</div>
          </div>
          <div className={`${toggle? 'TabsBin' : 'TabsBin-notActive'} ${toggle? 'TabsRound' : ''} ${Tabs? '' : 'TabsActive'}`} onClick={() => setTabs(false)}>
            <div className={`TabsBinTrash ${toggle? '' : 'TabsCircle'}`}><FontAwesomeIcon icon={ faTrashCan } /></div>
            <div className='TabsBinTrashText' style={{display : `${toggle? 'inline-flex' : 'none' }`}}>Trash</div>
          </div>
        </div>
        <div className={`${toggle? 'Notes' : 'Notes-notActive'}`}>
          {
            (searchValue.length===0) && (Tabs===true) && (<div className='TakeaNote'>
              <div className='NoteText'>
                <input type='text' placeholder='Take a Note...' className='TakeNoteInput' value={ takeANoteValue } onChange={ takeANoteValueChange }></input>
                <div className={`${(takeANoteValue.length>0)? 'AddNote' : 'Hidden'} Clickable`} onClick={postNote}><FontAwesomeIcon icon={faPlus} /></div>
                <div className={`${(takeANoteValue.length>0)? 'TextClear' : 'Hidden'} Clickable`} onClick={clearTakeANoteValue}><FontAwesomeIcon icon={ faXmark } /></div>
              </div>
            </div>)
          }
          <div className='NotesTaken'>
                {
                  (searchValue.length>0) && (searchedNotes.length===0? <p style={{fontSize:'3rem'}}>No Note Found</p> : searchedNotes.map((element)=>{
                    return (
                      <div className='Note' key={element._id}>
                        <div className='InnerText' onClick={trueModalState}>{element.note}</div><hr/>
                        <div className="Controls"><div className="Clickable" title="Delete"><FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon></div></div>
                      </div>
                    )
                  }))
                }
                {
                  (searchValue.length===0) && (Tabs===true) && (Notes.length<=0? <p style={{fontSize:'3rem'}}>Write a Note</p> : Notes.map((element)=>{
                    return (
                    <div className='Note' key={element._id}>
                      <div className='InnerText' onClick={(event)=>{trueModalState(event,element._id)}}>{element.note}</div><hr/>
                      <div className="Controls"><div className="Clickable" title="Delete" onClick={()=>{deleteNote(element._id)}}><FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon></div></div>
                    </div>)
                  }))
                }
                {
                  (searchValue.length===0) && (Tabs===false) && (DeletedNotes.length<=0? <p style={{fontSize:'3rem'}}>Trash Is Empty</p> : DeletedNotes.map((element)=>{
                    return (
                    <div className='Note' key={element._id}>
                      <div className='InnerText'>{element.note}</div><hr/>
                      <div className="Controls">
                        <div className="Clickable" title="Restore" onClick={()=>{restoreNote(element._id)}}><FontAwesomeIcon icon={faTrashCanArrowUp}></FontAwesomeIcon></div>
                        <div className="Clickable" title="Delete" onClick={()=>{trashNote(element._id)}}><FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon></div>
                      </div>
                    </div>)
                  }))
                }
                <div className='ModalContainer' style={{display : `${ModalState? 'block' : 'none' }`}}>
                  <div className='Modal'>
                    <div className='ModalContent' suppressContentEditableWarning={true} contentEditable={true} onInput={ModalTextChange} onChange={ModalTextChange}>
                      {ModalText}
                    </div><hr/>
                    <div className='ModalFooter'>
                      <div className='ModalClose' onClick={falseModalState}>Close</div>
                    </div>
                  </div>
                </div>
          </div>
        </div>
      </div></>}
      { loginState && <>
      <div className="Login">
        <div className='Card'>
        {/* <div className='Logo'><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png' alt='Notes'  className='Image'/></div> */}
        <div className='SignIn'><h2>Sign In</h2></div>
        <div className='Form'>
          <form>
            {state && (<>
            <div className='InputFields'><input type='username' placeholder='Username' onChange={(event) => setUserName(event.target.value)} value={username} style={{borderRadius:'5px',padding: '2% 2% 2% 2%'}}></input></div>
            <div className='InputFields'><input type='password' placeholder='Password' onChange={(event) => setPassword(event.target.value)} value={password} style={{borderRadius:'5px',padding: '2% 2% 2% 2%'}}></input></div>
            <div className='Footer'>
              <div className='Forgot'><div className='Button'>Forgot Password</div></div>
              <div className='Submit' onClick={() => handleSignInSubmit()}><div className='Button'>Login</div></div>
            </div>
            <div className='Button' onClick={() => setState(!state)}>
              Create Account
            </div></>)}
            {!state && (<>
            <div className='InputFields'><input type='username' placeholder='Username' onChange={(event) => setUserName(event.target.value)} value={username} style={{borderRadius:'8px',padding: '2% 2% 2% 2%'}}></input></div>
            <div className='InputFields'><input type='name' placeholder='Name' onChange={(event) => setName(event.target.value)} value={name} style={{borderRadius:'8px',padding: '2% 2% 2% 2%'}}></input></div>
            <div className='InputFields'><input type='password' placeholder='Password' onChange={(event) => setPassword(event.target.value)} value={password} style={{borderRadius:'8px',padding: '2% 2% 2% 2%'}}></input></div>
            <div className='Footer'>
            <div className='Button' onClick={() => setState(!state)}>Back</div>
              <div className='Submit' onClick={() => handleSignUpSubmit()}><div className='Button'>Submit</div></div>
            </div>
            </>)}
          </form>
          <hr />
          <div className='GoogleAuth'>
            <img src={GoogleLogo} alt='Google Sign-In'/>
          </div>
        </div>
      </div>
      </div>
      </>}
    </div>
  );
}

export default App;
