import { useState } from "react";
export default function TaxDeductionForm({handletokubetsukuminZeigakuKojo, handletominZeigakuKojo, kazeiHyojunKingaku, kyuyoSyotokuKingaku}) {
    const [haitoKojo, sethaitoKojo] = useState<number>(0);
    const [jutakuloanKojo, setjutakuloanKojo] = useState<number>(0);
    const [kifukinKojo, setkifukinKojo] = useState<number>(0);
    const [furusatoNozei, setfurusatoNozei] = useState<number>(0);

    //調整控除
    let choseiKojo:number = calcChoseiKojo(kazeiHyojunKingaku, kyuyoSyotokuKingaku);

    //寄附金控除
    let kifukinKojoTotal = (kifukinKojo - 2000) * 0.1;

    //税額控除金額を算出し、親に渡す。
    let tokubetsukuminZeigakuKojoTotal:number = 0;
    let tominZeigakuKojoTotal:number = 0;

    handletokubetsukuminZeigakuKojo(tokubetsukuminZeigakuKojoTotal);
    handletominZeigakuKojo(tominZeigakuKojoTotal);

    return (
    <section>
        <ul>
          <li>特別区民税：{tokubetsukuminZeigakuKojoTotal}</li>
          <li>都民税：{tominZeigakuKojoTotal}</li>
        </ul>
        <h3>調整控除</h3>
        <ul>
          <li>特別区民税：{choseiKojo[0]}</li>
          <li>都民税：{choseiKojo[1]}</li>
        </ul>
        <h3>寄付金税額控除</h3>
        <input
        type="number"
        value={kifukinKojo}
        onChange={(e)=>setkifukinKojo(parseInt(e.target.value))}
        />
    </section>
    );
}
function calcChoseiKojo(kazeiHyojunKingaku:number, kyuyoSyotokuKingaku:number):number{
    let jintekiKojoSagaku:number= kyuyoSyotokuKingaku<=25000000 ? 5 : 0;
    if(kazeiHyojunKingaku<=2000000){
        let base:number = Math.min(jintekiKojoSagaku, kazeiHyojunKingaku)
        return base*0.05;
    }else{
        let base:number = jintekiKojoSagaku - (kazeiHyojunKingaku - 2000000)
        if(base*0.05 < 2500){
            return 2500;
        }else{
            return base*0.05;
        }
    }
}
class zeigakuKojo{
    chosei:number;
    haito:number;
    jutakuloan:number;
    kifukin:number;
    furusato:number;

    syotoku:number;
    constructor(chosei:number, haito:number, jutakuloan:number, kifukin:number, furusato:number, syotoku:number){
        this.chosei = chosei;
        this.haito = haito;
        this.jutakuloan = jutakuloan;
        this.kifukin = kifukin;
        this.furusato = furusato;

        this.syotoku = syotoku;        
        if(this.kifukin + this.furusato > (this.syotoku * 0.3)){
            this.kifukin = this.syotoku * 0.3
        }else{
            this.kifukin = this.kifukin + this.furusato;
        }

    }
    gettokubetsukuminZeigakuKojoTotal(){
        let tokubetsukuminZeigakuKojoTotal: number = 
        this.chosei * 0.03 +
        this.kifukin * 0.06;
        return tokubetsukuminZeigakuKojoTotal;
    }     
}