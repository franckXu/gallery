import React from "react";
import style from "./style.module.scss";
import { TMoive } from "../../gallery";
import { isTypeCastExpression } from "@babel/types";

type TImage = {
  src: string;
  alt: string;
};

const Detail: React.SFC<TImage> = props => {
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    const img = new Image();

    img.addEventListener("load", () => {
      setLoading(false);
    });

    setLoading(true);
    img.src = props.src;
  }, []);

  return (
    <div className={style["container"]}>
      {loading ? (
        <div className={style["loading"]}>loading...</div>
      ) : (
        <img src={props.src} alt={props.alt} />
      )}
    </div>
  );
};

export default Detail;
