import React, { Component } from 'react';

class Resume extends Component {
  render() {

    if(this.props.data){
      var skillmessage = this.props.data.skillmessage;
      var education = this.props.data.education.map(function(education){
        return <div key={education.school}><h3>{education.school}</h3>
        <p className="info">{education.degree} <span>&bull;</span><em className="date">{education.graduated}</em></p>
        <p>{education.description}</p></div>
      })
      var work = this.props.data.work.map(function(work){
        return <div key={work.company}><h3>{work.company}</h3>
            <p className="info">{work.title}<span>&bull;</span> <em className="date">{work.years}</em></p>
            <p>{work.description}</p>
        </div>
      })
      var research = this.props.data.research.map(function(research){
        return <div key={research.company}><h3>{research.company}</h3>
            <p className="info">{research.title}<span>&bull;</span> <em className="date">{research.years}</em></p>
            <p>{research.description}</p>
        </div>
      })
      var skills = this.props.data.skills.map(function(skills){
        var className = 'bar-expand '+skills.name.toLowerCase();
        return <li key={skills.name}><em>{skills.name}</em></li>
      })
    }

    return (
      <section id="resume">

      <div className="row education">
         <div className="three columns header-col">
            <h1><span>Education</span></h1>
         </div>

         <div className="nine columns main-col">
            <div className="row item">
               <div className="twelve columns">
                 {education}
               </div>
            </div>
         </div>
      </div>


      <div className="row work">

         <div className="three columns header-col">
            <h1><span>Work Experince</span></h1>
         </div>

         <div className="nine columns main-col">
          {work}
         </div>
     </div>

     <div className="row work">

        <div className="three columns header-col">
           <h1><span>Research</span></h1>
        </div>

        <div className="nine columns main-col">
         {research}
        </div>
    </div>

   </section>
    );
  }
}

export default Resume;
