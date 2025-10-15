import React from "react";

interface CardProductProps {
  className?: string;
  status?: string;
  collection?: string;
  productName?: string;
  price?: string;
  collection2?: boolean;
  status2?: boolean;
  property1?: "Default" | "mobile variant" | "Variant3";
}

function CardProduct({
  className,
  status = "status",
  collection = "collection",
  productName = "Product name",
  price = ", price, ",
  collection2 = true,
  status2 = true,
  property1 = "Default",
}: CardProductProps) {
  return (
    <div className={className} data-name="Property 1=Default" data-node-id="10:50">
      <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="10:72">
        <div className="bg-[#d9d9d9] shrink-0 size-[459px]" data-node-id="10:27" />
        <div className="content-stretch flex flex-col font-['Avenir_LT_Std:35_Light',_sans-serif] gap-[2px] items-start not-italic relative shrink-0 text-black w-full" data-node-id="10:57">
          {status2 && (
            <p className="leading-[normal] relative shrink-0 text-[15px] tracking-[0.9px] uppercase w-full" data-node-id="10:28">
              {status}
            </p>
          )}
          {collection2 && (
            <p className="leading-[normal] relative shrink-0 text-[15px] tracking-[0.9px] uppercase w-full" data-node-id="10:38">
              {collection}
            </p>
          )}
          <p className="leading-[normal] relative shrink-0 text-[15px] tracking-[0.9px] w-full" data-node-id="10:39">
            {productName}
          </p>
          <div className="leading-[15px] relative shrink-0 text-[16px] tracking-[-0.8px] w-full" data-node-id="10:48">
            <p className="mb-0">{price}</p>
            <p>€ price</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CardProduct1() {
  return <CardProduct className="bg-white content-stretch flex flex-col gap-[8px] items-start relative size-full" />;
}
