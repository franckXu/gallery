import React from "react";
import style from "./style.module.scss";

type TProps = {
  keyWord: string;
  stars: string[];

  onKeyWordChange(val: string): void;
  onStarChange(val: string): void;
};

const SearchBar: React.SFC<TProps> = props => {
  return (
    <div className={style["search-bar"]}>
      <input
        type="search"
        value={props.keyWord}
        onChange={e => {
          props.onKeyWordChange(e.target.value);
        }}
      />
      <div className={style["star-checkbox-group"]}>
        {[...Array(5)].map((_, i) => {
          i = i + 1;
          return (
            <label htmlFor={"star" + i}>
              <input
                id={"star" + i}
                name="star"
                type="checkbox"
                key={i}
                value={i}
                checked={props.stars.indexOf(i + "") > -1}
                onChange={e => props.onStarChange(e.target.value)}
              />
              <span>{i}星</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default SearchBar;
