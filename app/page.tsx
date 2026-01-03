'use client'
import Image from "next/image";
import { useState } from "react";
import IncomeForm from "./incomeForm";
import IncomeDeductionForm from "./incomeDeductionForm";
import TaxDeductionForm from "./taxDeductionForm";

export default function Home() {
  const [kyuyoSyotokuKingaku, setKyuyoSyotokuKingaku] = useState<number>(0);
  const [shotokuKojoKingaku, setshotokuKojoKingaku] = useState<number>(0);
  const [tokubetsukuminZeigakuKojo, settokubetsukuminZeigakuKojo] = useState<number>(0);
  const [tominZeigakuKojo, settominZeigakuKojo] = useState<number>(0);

  const handleKyuyoSyotokuKingaku = (input:number) => {setKyuyoSyotokuKingaku(input)};
  const handleshotokuKojoKingaku = (input:number) => {setshotokuKojoKingaku(input)};
  const handletokubetsukuminZeigakuKojo = (input:number) => {settokubetsukuminZeigakuKojo(input)};
  const handletominZeigakuKojo = (input:number) => {settominZeigakuKojo(input)};

  let kazeiHyojunKingaku:number = kyuyoSyotokuKingaku - shotokuKojoKingaku;
  let tokubetsukuminZei:number = kazeiHyojunKingaku * 0.06;
  let tominZei:number = kazeiHyojunKingaku * 0.04;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h2>給与</h2>
        <IncomeForm handleKyuyoSyotokuKingaku={handleKyuyoSyotokuKingaku}></IncomeForm>
        <h3>給与所得金額</h3>
        <p>{kyuyoSyotokuKingaku}</p>
        <small>※所得金額調整控除は非対応です。</small>
        <h2>所得控除</h2>
        <IncomeDeductionForm handleshotokuKojoKingaku={handleshotokuKojoKingaku} kyuyoSyotokuKingaku={kyuyoSyotokuKingaku}></IncomeDeductionForm>
        <p>所得控除合計額：{shotokuKojoKingaku}</p>
        <h2>課税標準額</h2>
        <p>{kazeiHyojunKingaku}</p>
        <h2>所得割額（税額控除前）</h2>
        <ul>
          <li>特別区民税：{tokubetsukuminZei}</li>
          <li>都民税：{tominZei}</li>
        </ul>
        <h2>税額控除</h2>
        <TaxDeductionForm 
          handletokubetsukuminZeigakuKojo={handletokubetsukuminZeigakuKojo} 
          handletominZeigakuKojo={handletominZeigakuKojo} 
          kazeiHyojunKingaku={kazeiHyojunKingaku}
          kyuyoSyotokuKingaku={kyuyoSyotokuKingaku}
          ></TaxDeductionForm>
        <h2>所得割額</h2>
        <ul>
          <li>特別区民税：{tokubetsukuminZei - tokubetsukuminZeigakuKojo}</li>
          <li>都民税：{tominZei - tominZeigakuKojo}</li>
        </ul>
        <h2>均等割・森林環境税（国税）</h2>
        <ul>
          <li>特別区民税：3000</li>
          <li>都民税：1000</li>
          <li>森林環境税（国税）：1000</li>
        </ul>
        <small>※均等割の軽減措置は非対応です。</small>
        <h2>年税額</h2>
        <p>
          {(tokubetsukuminZei - tokubetsukuminZeigakuKojo)+(tominZei - tominZeigakuKojo)+5000}
        </p>
      </main>
    </div>
  );
}