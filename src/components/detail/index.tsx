import React from "react";
import style from "./style.module.scss";
import { TMoive } from "../../gallery";
import { isTypeCastExpression } from "@babel/types";

type TDetailProps = TMoive & {
  onCloseBtnClick(): void;
};

const Detail: React.SFC<TDetailProps> = props => {
  return (
    <div className={style["detail-content"]}>
      <a href={props.url} target="_blank">
        <img src={props.cover} alt={props.title} />
      </a>

      <div className={style["detail-content-right"]}>
        <p className={style["detail-content-title"]}>{props.title}</p>
        <p className={style["detail-content-star"]}>
          {[...Array(Math.round(+props.star * 0.1))].map((item, i) => {
            return "❤";
          })}
        </p>
        <p>
          <span>导演: </span>
          {props.directors.map((director, i) => {
            return (
              <>
                <a href="#" key={i}>
                  {director}
                </a>
                {i === props.directors.length - 1 ? null : " / "}
              </>
            );
          })}
        </p>
        <p>
          <span>主演:</span>
          {props.casts.map((cast, i) => {
            return (
              <>
                <a href="#" key={i}>
                  {cast}
                </a>{" "}
                {i === props.casts.length - 1 ? null : " / "}
              </>
            );
          })}
        </p>
      </div>

      <div className={style["close-btn"]} onClick={props.onCloseBtnClick}>
        X
      </div>
    </div>
  );
};

export default Detail;
