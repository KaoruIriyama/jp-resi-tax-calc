export default function NumForm(data:number,setDataState:any) {
  return (
      <input
        type="number"
        value={data}
        onChange={(e)=>setDataState(parseInt(e.target.value))}
      />
  );
}