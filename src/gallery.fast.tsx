import React from "react";
import style from "./gallery.module.scss";
import cx from "classnames";
import Detail from "./components/detail";
import Cover from "./components/cover";
import SearchBar from "./components/search-bar";

const SearchBarMemo = React.memo(SearchBar);

const movies = require("./data.json");

const PAGE_SIZE = 50;

export type TMoive = {
  directors: string[];
  rate: string;
  cover_x: number;
  star: string;
  title: string;
  url: string;
  casts: string[];
  cover: string;
  id: string;
  cover_y: number;
};

type TQueryParams = {
  start: number;

  directors?: string[];
  rate?: string;
  star?: string;
  title?: string;
  casts?: string[];
};

type TGenData = (Q: TQueryParams) => Promise<TMoive[]>;
const genData: TGenData = q => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      const ret: TMoive[] = [];
      if (q.start >= movies.length) return res([]);
      for (let i = q.start, len = q.start + PAGE_SIZE; i < len; i++) {
        movies[i] && ret.push(movies[i]);
      }
      res(ret);
    }, 1000 + Math.random() * 3000);
  });
};

const filterWithKeyword = (
  data: TMoive[],
  stars: string[],
  keyWord: string
) => {
  return data.filter(item => {
    const matchCast =
      !keyWord || item.casts.some(cast => cast.indexOf(keyWord) > -1);
    const matchTitle = !keyWord || item.title.search(keyWord) > -1;
    const matchStar =
      !stars.length ||
      stars.some(star => {
        return Math.round(+item.star * 0.1) + "" === star;
      });

    return (matchCast || matchTitle) && matchStar;
  });
};

type TListProps = {
  data: TMoive[];
  onMovieClick(i: number): void;
};
const List: React.SFC<TListProps> = ({ data, onMovieClick }) => {
  return (
    <>
      {data.map((item, i) => {
        return (
          <MovieMemo
            key={i}
            idx={i}
            name={item.title}
            image={item.cover}
            onMovieClick={onMovieClick}
          />
        );
      })}
    </>
  );
};
const ListMemo = React.memo(List);

const App: React.FC = () => {
  const [data, setData] = React.useState<TMoive[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [queryParams, setQueryParams] = React.useState<TQueryParams>({
    start: 0
  });
  const [curMovieIdx, setCurMovieIdx] = React.useState<number>(-1);
  const [keyWord, setKeyWord] = React.useState<string>("");
  const [stars, setStars] = React.useState<string[]>([]);

  const [currentCoverBg, setCurrentCoverBg] = React.useState<string>("");

  const appRef = React.useRef<HTMLDivElement>(null);

  const onElevatorClick = () => {
    if (!appRef.current) return;

    appRef.current.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const onStarChange = React.useCallback(
    (star: string) => {
      const idx = stars.indexOf(star);
      if (idx > -1) {
        setStars(stars => {
          stars.splice(idx, 1);
          return [...stars];
        });
      } else {
        setStars([...stars, star]);
      }
    },
    [stars]
  );

  const dataMemo = React.useMemo(() => {
    return filterWithKeyword(data, stars, keyWord);
  }, [data, stars, keyWord]);

  React.useEffect(() => {
    if (!appRef.current) return;

    const handleBodyScroll = (e: any) => {
      if (
        loading ||
        e.target.clientHeight + e.target.scrollTop < e.target.scrollHeight - 200
      )
        return;
      setQueryParams(state => ({ ...state, start: state.start + PAGE_SIZE }));
    };

    appRef.current.addEventListener("scroll", handleBodyScroll);

    return () => {
      appRef.current &&
        appRef.current.removeEventListener("scroll", handleBodyScroll);
    };
  }, [appRef, loading]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        console.log(queryParams);
        const resp = await genData(queryParams);

        setLoading(false);
        setData(state => state.concat(resp));
      } catch (e) {
        setLoading(false);
        alert(e);
      }
    };

    fetchData();
  }, [queryParams]);

  return (
    <div className={style.app} ref={appRef}>
      {loading && !data.length ? (
        <div>loading...</div>
      ) : (
        <>
          <ListMemo data={dataMemo} onMovieClick={setCurMovieIdx} />
          {loading ? <div style={{ width: "100%" }}>loading...</div> : null}
        </>
      )}

      {data.length ? (
        <div
          className={style["refresh-bg"]}
          onClick={() => {
            setCurrentCoverBg(
              data[Math.floor(Math.random() * (data.length - 1))].cover
            );
          }}
        >
          CHG
        </div>
      ) : null}

      <div className={style["elevator"]} onClick={onElevatorClick}>
        Top
      </div>

      <div className={style["cover-bg"]}>
        <img src={currentCoverBg} alt="" />
      </div>

      <SearchBarMemo
        stars={stars}
        keyWord={keyWord}
        onKeyWordChange={setKeyWord}
        onStarChange={onStarChange}
      />

      {curMovieIdx > -1 ? (
        <div className={style["detail"]}>
          <div
            className={cx(
              style["detail-prev-btn"],
              curMovieIdx < 1 && style["detail-prev-btn-hide"]
            )}
            onClick={() => setCurMovieIdx(curMovieIdx - 1)}
          >
            &lt;
          </div>
          <Detail
            {...filterWithKeyword(data, stars, keyWord)[curMovieIdx]}
            onCloseBtnClick={() => setCurMovieIdx(-1)}
          />
          <div
            className={cx(
              style["detail-next-btn"],
              curMovieIdx ===
                filterWithKeyword(data, stars, keyWord).length - 1 &&
                style["detail-next-btn-hide"]
            )}
            onClick={() => setCurMovieIdx(curMovieIdx + 1)}
          >
            &gt;
          </div>
        </div>
      ) : null}
    </div>
  );
};

const Movie: React.SFC<{
  idx: number;
  name: string;
  image: string;

  onMovieClick(idx: number): void;
}> = props => {
  return (
    <div
      className={cx(style.movie)}
      onClick={() => props.onMovieClick(props.idx)}
    >
      <div>
        <Cover src={props.image} alt={props.name} />
      </div>
      <div className={style["movie-mask"]}>
        <div className={style["movie-dot"]}>...</div>
      </div>
    </div>
  );
};

const MovieMemo = React.memo(Movie);

export default App;
