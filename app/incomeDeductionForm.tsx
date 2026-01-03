import { useState } from "react";
export default function IncomeDeductionForm({handleshotokuKojoKingaku, kyuyoSyotokuKingaku}) {
    const [syakaiHokenRyoKojo, setsyakaiHokenRyoKojo] = useState<number>(0);
    const [iDeCo, setiDeCo] = useState<number>(0);
    const [kaigoIryoHokenRyoKojo, setkaigoIryoHokenRyoKojo] = useState<number>(0);
    const [ippanSeimeiHokenRyoKojo, setippanSeimeiHokenRyoKojo] = useState<number>(0);
    const [kojinNenkinHokenRyoKojo, setkojinNenkinHokenRyoKojo] = useState<number>(0);
    const [jishinHokenRyo, setjishinHokenRyo] = useState<number>(0);

    //基礎控除の計算
    let kisoKojo:number = calcKisoKojo(kyuyoSyotokuKingaku);

    //生命保険料控除の計算
    let seimeihokenRyoKojoTotal = 
        calcSeimeiHokenRyoKojo(kaigoIryoHokenRyoKojo) + 
        calcSeimeiHokenRyoKojo(ippanSeimeiHokenRyoKojo) + 
        calcSeimeiHokenRyoKojo(kojinNenkinHokenRyoKojo);
    let seimeiHokenRyoKojo = seimeihokenRyoKojoTotal>70000 ? 70000:seimeihokenRyoKojoTotal;

    //地震保険料の計算
    let jishinHokenRyoKojo = (jishinHokenRyo/2)>25000 ? 25000:jishinHokenRyo/2;

    //所得控除金額を算出し、親に渡す。
    let syotokuKojoTotal:number;
    syotokuKojoTotal = kisoKojo + syakaiHokenRyoKojo + iDeCo + seimeiHokenRyoKojo;

    handleshotokuKojoKingaku(syotokuKojoTotal);

    return (
    <section>
        <h3>基礎控除</h3>
        <p>{kisoKojo}</p>
        <h3>社会保険料控除</h3>
        <input
        type="number"
        value={syakaiHokenRyoKojo}
        onChange={(e)=>setsyakaiHokenRyoKojo(parseInt(e.target.value))}
        />
        <h3>小規模企業共済等掛金控除</h3>
        <input
        type="number"
        value={iDeCo}
        onChange={(e)=>setiDeCo(parseInt(e.target.value))}
        />
        <h3>生命保険料控除</h3>
            <h4>介護医療保険料控除</h4>
                <input
                type="number"
                value={kaigoIryoHokenRyoKojo}
                onChange={(e)=>setkaigoIryoHokenRyoKojo(parseInt(e.target.value))}
                />
            <h4>一般生命保険料控除</h4>
                <input
                type="number"
                value={ippanSeimeiHokenRyoKojo}
                onChange={(e)=>setippanSeimeiHokenRyoKojo(parseInt(e.target.value))}
                />
            <h4>個人年金保険料控除</h4>
                <input
                type="number"
                value={kojinNenkinHokenRyoKojo}
                onChange={(e)=>setkojinNenkinHokenRyoKojo(parseInt(e.target.value))}
                />
            <p>合計額：{seimeiHokenRyoKojo}</p>
            <p>
                <small>平成24年1月1日以後に締結した保険契約等にのみ対応</small>
            </p>
        <h3>地震保険料控除</h3>
        <input
        type="number"
        value={jishinHokenRyo}
        onChange={(e)=>setjishinHokenRyo(parseInt(e.target.value))}
        />
        <p>
            <small>平成18年までに締結した長期損害保険料には非対応</small>
        </p>
    </section>
    );
}
//所得金額から基礎控除を判定する。
function calcKisoKojo(kyuyoSyotokuKingaku:number):number{
    if(kyuyoSyotokuKingaku<24000000){
        return 430000;
    }else if(kyuyoSyotokuKingaku<24500000){
        return 290000;
    }else if(kyuyoSyotokuKingaku<25000000){
        return 150000;
    }else{
        return 0;
    }
}
//生命保険料から生命保険料控除を計算する。
function calcSeimeiHokenRyoKojo(inputtedHokenRyo:number):number{
    if(inputtedHokenRyo<12000){
        return inputtedHokenRyo;
    }else if(inputtedHokenRyo<32000){
        return inputtedHokenRyo/2 + 6000;
    }else if(inputtedHokenRyo<56000){
        return inputtedHokenRyo/4 + 14000;
    }else{
        return 28000;
    }
}