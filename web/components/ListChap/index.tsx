import styles from './styles.module.css'
export function ListChap() {
  return (
    <div style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '250px',
      height: '400px',
      borderRadius: '10px',
      marginBottom: '19px',
      color: '#fff',
    }} className={styles.listChapp}>
      <div style={{
        padding: '20px 25px',
        width: '100%',
        height: '100%',
        borderRadius: '10px 10px 0px 0px',
        marginBottom: '19px',
        color: '#fff',
      }} className={styles.listChap}>
      </div>
      <div className={styles.textlistChap}>
        <div className={styles.text}>
          <h1>Phat's Dev</h1>
          <span style={{
            color: '#A7ACC0',
            marginBottom: '10px',
            padding: '10px 0'
          }}>hehe</span>
        </div>
        <div style={{
          display: 'flex',
          bottom: 0,
          padding: '20px',
        }}>
          <div style={{
            width: '100%',
          }} ></div>
          <button style={{
            background: '#292B33',
            color: '#BBC1D6',
            padding: '5px 15px',
            borderRadius: '8px'
          }} className={'border-[#434754] border-solid border-[1px] hover:border-[#2F4DEE]'}>View</button>
        </div>
      </div>
    </div>
  )
}