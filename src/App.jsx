import data from './scanning_report.json'
import './App.css'
import { useState } from 'react';

function App() {
  const [filter, setFilter] = useState("Negligible")

  const vulnerabilities = data.matches;
  const criticalVulnerabilities = vulnerabilities.filter(v => {
    return v.vulnerability.severity == filter
  })

  // console.log(criticalVulnerabilities)

  const severityCounts = {}
  vulnerabilities.forEach(v => {
    const severity = v.vulnerability.severity
    if (severity in severityCounts){
      severityCounts[severity] += 1
    } else {
      severityCounts[severity] = 1
    }
  })

  const getDetailInfo = (dict) => {
    let output = ""
    Object.keys(dict).forEach(k => {
      output = output.concat(`${k}: ${dict[k]};`)
    })
    return output
  }

  const now = new Date(Date.now())

  return (
    <>
    <div className="App">
      <h1>Vulnerability Scanning Report</h1>
      <p style={{fontStyle:"italic"}}>* base on container-scan-report.json generated from Pipeline #248</p>
      <p><b>Image under Scan:</b> <span style={{fontStyle: "italic"}}>{data.source.target.userInput}</span></p>
      <h3 className="hovertext" 
        data-hover= {getDetailInfo(severityCounts)}>
              Total number of Vulnerabilities: {vulnerabilities.length}
      </h3>
      <p style={{fontStyle:"italic"}}>
      {
          Object.keys(severityCounts).map(k => (
            <span className={k == "Critical" ? "critical" : null}>{k}: {severityCounts[k]} &nbsp;</span>
          ))
      }
      </p>
      <div className="opt-group">
        <label htmlFor="levels"><b style={{fontStyle:"italic"}}>SEVERITY LEVEL: </b>&nbsp;</label>
        <select name="levels" id="levels" onChange={(e) => {setFilter(e.target.value)}} className="select">
          {Object.keys(severityCounts).map(k => (
            <option className={k == "Critical" ? "critical" : null} value={`${k}`} key={k}>{k} ({severityCounts[k]})</option>
          ))}
        </select>
      </div>

      <table className="vtable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
        {
          criticalVulnerabilities.map((cv, index) => (
            <tr key={index}>
              <td className="v-id">
                ({index + 1}) - &nbsp;
                <a href={`${cv.vulnerability.dataSource}`} target="_blank">
                  {cv.vulnerability.id}
                </a>
                </td>
              <td>{cv.vulnerability.description ? cv.vulnerability.description : "N/A"}</td>
            </tr>
          ))
        }
        </tbody>
      </table>
   </div>
   <footer>
    Build with Vite & React, HTML page is created at&nbsp;
    <span style={{fontStyle: "italic", fontSize: "0.8rem"}}>
      {now.toUTCString()}, &nbsp;
    </span>
    <a href="https://github.com/sihanchen01/cp2422_A3_report" target="_blank">
      Source Code
    </a>
   </footer>
   </>
  )
}

export default App
