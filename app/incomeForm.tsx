'use client'
import { useState } from "react";
import NumForm from "./numForm";

export default function IncomeForm({handleKyuyoSyotokuKingaku}) {
  const [kyuyoShunyuKingaku, setKyuyoShyunyuKingaku] = useState<number>(0);

  //給与所得金額を算出し、親に渡す。
  let kyuyoShotokuKingaku:number;
  kyuyoShotokuKingaku = calcShotokuKingaku(kyuyoShunyuKingaku);

  handleKyuyoSyotokuKingaku(kyuyoShotokuKingaku);

  return (
    <section>
      <h3>給与収入</h3>
      <input
        type="number"
        value={kyuyoShunyuKingaku}
        onChange={(e)=>setKyuyoShyunyuKingaku(parseInt(e.target.value))}
      />
    </section>
  );
}
/*
給与収入金額から給与所得金額を算出する。
参考：https://www.city.adachi.tokyo.jp/ze/kurashi/zekin/kesan-juminzegaku.html
*/
function calcShotokuKingaku(inputtedShunyu:number):number{
  let result:number;

  if(inputtedShunyu<550999){
    result = 0;
  }else if(inputtedShunyu<1618999){
    result = inputtedShunyu - 550000;
  }else if(inputtedShunyu<1619999){
    result = 1069000;
  }else if(inputtedShunyu<1621999){
    result = 1070000;
  }else if(inputtedShunyu<1623999){
    result = 1072000;
  }else if(inputtedShunyu<1627999){
    result = 1074000;
  }else if(inputtedShunyu<1799999){
    result = divideWith4(inputtedShunyu) * 2.4 + 100000;
  }else if(inputtedShunyu<3599999){
    result = divideWith4(inputtedShunyu) * 2.8 - 80000;
  }else if(inputtedShunyu<6599999){
    result = divideWith4(inputtedShunyu) * 3.2 - 440000;
  }else if(inputtedShunyu<8499999){
    result = inputtedShunyu * 0.9 -1100000;
  }else{
    result = inputtedShunyu - 1950000;
  }
  return result;
}
//4で除算し、1000以下の値切り捨て。
function divideWith4(origin:number):number {
  const divided:number = origin / 4;
  const result:number = Math.floor(divided / 1000) * 1000;
  return result;
}