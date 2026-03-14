import { useState, useEffect } from "react";
import NumForm from "./numForm";
export default function TaxDeductionForm({ handletokubetsukuminZeigakuKojo, handletominZeigakuKojo, kazeiHyojunKingaku, kyuyoSyotokuKingaku }:
    { handletokubetsukuminZeigakuKojo: any; handletominZeigakuKojo: any; kazeiHyojunKingaku: number; kyuyoSyotokuKingaku: number }) {

    const [isHaitoChecked, setIsHaitoChecked] = useState(false);
    const [riekiHaito, setriekiHaito] = useState<number>(0);
    const [shokenHaito, setshokenHaito] = useState<number>(0);
    const [gaikaShokenHaito, setgaikaShokenHaito] = useState<number>(0);
    const [syotokuzei, setsyotokuzei] = useState<number>(0);
    const [isJutakuloanChecked, setIsJutakuloanChecked] = useState(false);
    const [jutakuloanzandaka, setjutakuloanzandaka] = useState<number>(0);
    const [kifukinKojo, setkifukinKojo] = useState<number>(0);
    const [furusatoNozei, setfurusatoNozei] = useState<number>(0);

    const handleJutakuloanChange = (event: any) => { setIsJutakuloanChecked(event.target.checked); };
    const handleHaitoChange = (event: any) => { setIsHaitoChecked(event.target.checked); };
    //（５）税額控除の計算
    //調整控除
    let choseiKojo: number = calcChoseiKojo(kazeiHyojunKingaku, kyuyoSyotokuKingaku);
    // 配当控除
    let haitoKojo: number = isHaitoChecked ? calcHaitoKojo(kazeiHyojunKingaku, riekiHaito, shokenHaito, gaikaShokenHaito) : 0;

    //住宅ローン控除
    let jutakuloanKojoTotal = isJutakuloanChecked ? calcJutakuloanKojo(jutakuloanzandaka, syotokuzei, kazeiHyojunKingaku) : 0;
    //寄附金控除
    let kifukinKojoTotal = kifukinKojo === 0 ? kifukinKojo : (kifukinKojo - 2000) * 0.1;
    // 地方公共団体に対しての寄附金控除(ふるさと納税)
    let perShotokuZeiritsu = calcFurusatoKojoZeiritsu(kazeiHyojunKingaku, kyuyoSyotokuKingaku);
    let furusatoNozeiTotal = furusatoNozei === 0 ? furusatoNozei : (furusatoNozei - 2000) * ((0.9 - perShotokuZeiritsu) * 1.021);

    //TODO: ふるさと納税　ワンストップ特例計算ロジックの実装
    // TODO: 外国税額控除と配当割額・株式等譲渡割額の扱いを考える
    //税額控除金額を算出し、親に渡す。
    console.log(`調整控除：${choseiKojo} 配当控除：${haitoKojo} 住宅ローン控除：${jutakuloanKojoTotal}`);
    console.log(`寄付金控除：${kifukinKojoTotal} ふるさと納税控除：${furusatoNozeiTotal}`)
    let zkj = new zeigakuKojo(choseiKojo, haitoKojo, jutakuloanKojoTotal, kifukinKojoTotal, furusatoNozeiTotal, kyuyoSyotokuKingaku);
    let tokubetsukuminZeigakuKojoTotal: number = zkj.gettokubetsukuminZeigakuKojoTotal();
    let tominZeigakuKojoTotal: number = zkj.gettominZeigakuKojoTotal();

    useEffect(() => {
        handletokubetsukuminZeigakuKojo(tokubetsukuminZeigakuKojoTotal);
    }, [tokubetsukuminZeigakuKojoTotal]);

    useEffect(() => {
        handletominZeigakuKojo(tominZeigakuKojoTotal);
    }, [tominZeigakuKojoTotal]);

    return (
        <section>
            <ul>
                <li>特別区民税：{tokubetsukuminZeigakuKojoTotal}</li>
                <li>都民税：{tominZeigakuKojoTotal}</li>
            </ul>
            <h3>調整控除</h3>
            <ul>
                <li>特別区民税：{choseiKojo * 0.6}</li>
                <li>都民税：{choseiKojo * 0.4}</li>
            </ul>
            <h3>配当控除  [計算する<input type="checkbox" checked={isHaitoChecked} onChange={handleHaitoChange} />]</h3>
            {/* &&演算子を使って、trueの時だけulを表示 */}
            {isHaitoChecked && (
                <ul>
                    <li>利益の配当、剰余金の分配、<br />特定株式投資信託の収益の分配：<NumForm data={riekiHaito} setDataState={setriekiHaito}></NumForm></li>
                    <li>証券投資信託の収益の分配：<NumForm data={shokenHaito} setDataState={setshokenHaito}></NumForm></li>
                    <li>外貨建証券投資信託の収益の分配：<NumForm data={gaikaShokenHaito} setDataState={setgaikaShokenHaito}></NumForm></li>
                </ul>
            )}
            <h3>住宅ローン控除  [計算する<input type="checkbox" checked={isJutakuloanChecked} onChange={handleJutakuloanChange} />]</h3>
            {/* &&演算子を使って、trueの時だけulを表示 */}
            {isJutakuloanChecked && (
                <ul>
                    <li>住宅ローン残高：<NumForm data={jutakuloanzandaka} setDataState={setjutakuloanzandaka}></NumForm></li>
                    <li>所得税：<NumForm data={syotokuzei} setDataState={setsyotokuzei}></NumForm></li>
                </ul>
            )}
            <h3>寄付金税額控除</h3>
            <NumForm data={kifukinKojo} setDataState={setkifukinKojo}></NumForm>
            <h3>ふるさと納税控除</h3>
            <NumForm data={furusatoNozei} setDataState={setfurusatoNozei}></NumForm>
        </section>
    );
}

//調整控除計算
function calcChoseiKojo(kazeiHyojunKingaku: number, kyuyoSyotokuKingaku: number): number {
    //人的基礎控除差額
    const kazeiHyojun_Threshold: number = 2000000;//課税標準額の閾値
    let jintekiKojoSagaku: number = kyuyoSyotokuKingaku <= 25000000 ? 50000 : 0;
    let kojoSagaku_base: number = 0;

    if (kazeiHyojunKingaku <= kazeiHyojun_Threshold) {
        kojoSagaku_base = Math.min(jintekiKojoSagaku, kazeiHyojunKingaku)
        return kojoSagaku_base * 0.05;
    } else {
        kojoSagaku_base = jintekiKojoSagaku - (kazeiHyojunKingaku - kazeiHyojun_Threshold)
        return Math.max(kojoSagaku_base * 0.05, 2500);
    }
}
// 配当控除計算
function calcHaitoKojo(kazeiHyojunKingaku: number, riekiHaito: number, shokenHaito: number, gaikaShokenHaito: number): number {

    let haitoKojoTotal: number = 0;
    //課税総所得金額（山林・退職所得を除く）が1000万円を超えるか
    let isSyotokuHyojunOver: boolean = !(kazeiHyojunKingaku <= 10000000);
    // 利益の配当、剰余金の分配、特定株式投資信託の収益の分配
    let riekiHaitoKojo: number = isSyotokuHyojunOver ? riekiHaito * 0.008 : riekiHaito * 0.016;
    // 証券投資信託の収益の分配(特定株式投資信託、外貨建証券投資信託を除く）
    let shokenHaitoKojo: number = isSyotokuHyojunOver ? shokenHaito * 0.004 : shokenHaito * 0.008;
    // 外貨建証券投資信託の収益の分配（特定外貨建投資信託を除く）
    let gaikaShokenHaitoKojo: number = isSyotokuHyojunOver ? gaikaShokenHaito * 0.002 : gaikaShokenHaito * 0.004;
    haitoKojoTotal = riekiHaitoKojo + shokenHaitoKojo + gaikaShokenHaitoKojo;
    return haitoKojoTotal;
}
//住宅ローン控除計算
function calcJutakuloanKojo(jutakuloanzandaka: number, syotokuzei: number, kazeiHyojunKingaku: number): number {
    const jutakuloanKojoritsu_syotoku: number = 0.007;
    let jutakuloan_sagaku: number = jutakuloanzandaka * jutakuloanKojoritsu_syotoku - syotokuzei;

    let jutakuloan_KojoGendo: number = 136500; // 居住開始年月 平成28年1月から令和3年12月まで | 令和4年1月から令和7年12月まで :97500
    let jutakuloanKojoritsu_jumin: number = 0.07; // 居住開始年月 平成28年1月から令和3年12月まで | 令和4年1月から令和7年12月まで :0.05
    let jutakuloanKojo_Threshold: number = Math.min(kazeiHyojunKingaku * jutakuloanKojoritsu_jumin, jutakuloan_KojoGendo);

    let jutakuloanKojoTotal: number = Math.min(jutakuloan_sagaku, jutakuloanKojo_Threshold);
    return jutakuloanKojoTotal;
}

//所得税率一覧表（平成27年分以後）を元に所得税率を計算する。
function calcFurusatoKojoZeiritsu(kazeiHyojunKingaku: number, kyuyoSyotokuKingaku: number): number {
    // TODO: 住民税の課税所得金額＝課税標準額であっているか確定させる
    let jintekiKojoSagaku: number = kyuyoSyotokuKingaku <= 25000000 ? 50000 : 0;
    // 住民税の課税所得金額(課税標準額？) - 人的控除差調整額（ 人的控除額の差額の合計額）
    let kojoSagaku_base: number = kazeiHyojunKingaku - jintekiKojoSagaku;
    if (kojoSagaku_base <= 1950000) {// 1,950,000円以下                          5％
        return 0.05;
    } else if (kojoSagaku_base <= 3300000) {// 1,950,001円から3,300,000円               10％
        return 0.1;
    } else if (kojoSagaku_base <= 6950000) {// 3,300,001円から6,950,000円               20％
        return 0.2;
    } else if (kojoSagaku_base <= 9000000) {// 6,950,001円から9,000,000円               23％
        return 0.23;
    } else if (kojoSagaku_base <= 18000000) {// 9,000,001円から18,000,000円              33％
        return 0.33;
    } else if (kojoSagaku_base <= 3300000) {// 18,000,001円から40,000,000円             40％
        return 0.4;
    } else {// 40,000,001円以上	                        45％
        return 0.45;
    }
}
//税額控除計算ロジック
class zeigakuKojo {
    chosei: number;//調整控除
    haito: number;//配当控除
    jutakuloan: number;//住宅ローン控除
    kifukin: number;//寄付金
    furusato: number;//ふるさと納税
    syotoku: number;//
    constructor(chosei: number, haito: number, jutakuloan: number, kifukin: number, furusato: number, syotoku: number) {
        this.chosei = chosei;
        this.haito = haito;
        this.jutakuloan = jutakuloan;
        this.kifukin = kifukin;
        this.furusato = furusato;

        this.syotoku = syotoku;
        //NOTE:所得*0.3とふるさと納税のうち小さいほうを寄付金として算出するから以下のように書ける？？
        this.kifukin = Math.min((this.kifukin + this.furusato), this.syotoku * 0.3);

    }
    //特別区民税の税額控除合計額計算
    gettokubetsukuminZeigakuKojoTotal(): number {
        let tokubetsukuminZeigakuKojoTotal: number =
            this.chosei * 0.6 //区3%(=調整控除5%の6割)
            + this.haito
            + this.jutakuloan * 0.6 //区5分の3
            + this.kifukin * 0.06 //区6％
            // + this.furusato * 0.6 //区5分の3
            ;
        return tokubetsukuminZeigakuKojoTotal;
    }
    //都民税の税額控除合計額計算
    gettominZeigakuKojoTotal(): number {
        let tokubetsukuminZeigakuKojoTotal: number =
            this.chosei * 0.4 //都2%(=調整控除5%の4割)
            + this.haito * 0.5 // 配当控除　都民税控除額は区民税控除額の半分
            + this.jutakuloan * 0.4 //都5分の2
            + this.kifukin * 0.04 //都4％
            // + this.furusato * 0.4 //都5分の2
            ;
        return tokubetsukuminZeigakuKojoTotal;
    }
    // TODO: 税額控除の小数点以下扱いを調べる
}