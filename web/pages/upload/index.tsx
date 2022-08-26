import React from 'react'

export default function index() {
  const [file, setFile] = React.useState<HTMLInputElement | undefined>();
  return (
    <>
      <input onChange={(e) => {
        if (e) {
          setFile(e.target)
        }
        
      }} type={'file'}/>
      <button onClick={() => {
        if (file?.files) {
          const f = file.files[0]
          const reader = new FileReader();
          reader.onload = function () {
            if (reader.result) {
              fetch('http://localhost:1688/save', {
                headers: {
                  'Content-Type': 'application/json'
                },
                method: 'post',
                body: JSON.stringify({
                  message: `${reader.result}`
                })
              }).then(data => data.json()).then(res => {
                console.log(res)
              })
            }
            
          }
        reader.readAsDataURL(f);
          
        }
      }}>Upload</button>
    </>
    
  )
}
