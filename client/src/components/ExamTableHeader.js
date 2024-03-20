
function ExamTableHeader(props){
    const headers=props.headers;
    const retval=headers.map(name=>{return <th scope="col" key={`${name}-header`} >{name}</th>})
    return <tr>{retval}</tr>;
}

export default ExamTableHeader