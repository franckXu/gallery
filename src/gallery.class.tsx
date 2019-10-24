import React from "react";
import style from "./gallery.module.scss";
import cx from "classnames";
import Detail from "./components/detail";
import Cover from "./components/cover";
import SearchBar from "./components/search-bar";

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
          <Movie
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

type TState = {
  data: TMoive[];
  loading: boolean;
  queryParams: TQueryParams;
  curMovieIdx: number;
  keyWord: string;
  stars: string[];
  currentCoverBg: string;
};

class App extends React.Component<{}, TState> {
  appRef: React.RefObject<HTMLDivElement>;

  constructor(props: {}) {
    super(props);

    this.state = {
      data: [],
      loading: false,
      queryParams: { start: 0 },
      curMovieIdx: -1,
      keyWord: "",
      stars: [],
      currentCoverBg: ""
    };

    this.appRef = React.createRef();
  }

  componentDidMount() {
    if (this.appRef.current) {
      console.log("addEventListener");
      this.appRef.current.addEventListener("scroll", this.handleBodyScroll);
    }
    this.fetchData();
  }

  componentWillUnmount() {
    this.appRef.current &&
      this.appRef.current.removeEventListener("scroll", this.handleBodyScroll);
  }

  fetchData = async () => {
    try {
      this.setState({ loading: true });

      // console.log(queryParams);
      const resp = await genData(this.state.queryParams);

      this.setState({ loading: false, data: this.state.data.concat(resp) });
    } catch (e) {
      this.setState({ loading: false });
      alert(e);
    }
  };

  handleBodyScroll = (e: any) => {
    if (
      this.state.loading ||
      e.target.clientHeight + e.target.scrollTop < e.target.scrollHeight - 200
    )
      return;

    this.setState(
      {
        queryParams: {
          ...this.state.queryParams,
          start: this.state.queryParams.start + PAGE_SIZE
        }
      },
      this.fetchData
    );
  };

  onMovieClick = (i: number) => {
    // console.log(item, i);
    this.setState({ curMovieIdx: i });
  };

  onElevatorClick = () => {
    if (!this.appRef.current) return;

    this.appRef.current.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  render() {
    const {
      data,
      loading,
      curMovieIdx,
      keyWord,
      stars,
      currentCoverBg
    } = this.state;

    return (
      <div className={style.app} ref={this.appRef}>
        {loading && !data.length ? (
          <div>loading...</div>
        ) : (
          <>
            <List
              data={filterWithKeyword(data, stars, keyWord)}
              onMovieClick={this.onMovieClick}
            />
            {loading ? <div style={{ width: "100%" }}>loading...</div> : null}
          </>
        )}

        {data.length ? (
          <div
            className={style["refresh-bg"]}
            onClick={() => {
              this.setState({
                currentCoverBg:
                  data[Math.floor(Math.random() * (data.length - 1))].cover
              });
            }}
          >
            CHG
          </div>
        ) : null}

        <div className={style["elevator"]} onClick={this.onElevatorClick}>
          Top
        </div>

        <div className={style["cover-bg"]}>
          <img src={currentCoverBg} alt="" />
        </div>

        <SearchBar
          stars={stars}
          keyWord={keyWord}
          onKeyWordChange={val => this.setState({ keyWord: val })}
          onStarChange={star => {
            const idx = stars.indexOf(star);
            if (idx > -1) {
              this.setState({
                stars: [...this.state.stars.splice(idx, 1)]
              });
            } else {
              this.setState({ stars: [...this.state.stars, star] });
            }

            console.log(star);
          }}
        />

        {curMovieIdx > -1 ? (
          <div className={style["detail"]}>
            <div
              className={cx(
                style["detail-prev-btn"],
                curMovieIdx < 1 && style["detail-prev-btn-hide"]
              )}
              onClick={() =>
                this.setState({ curMovieIdx: this.state.curMovieIdx - 1 })
              }
            >
              &lt;
            </div>
            <Detail
              {...filterWithKeyword(data, stars, keyWord)[curMovieIdx]}
              onCloseBtnClick={() => this.setState({ curMovieIdx: -1 })}
            />
            <div
              className={cx(
                style["detail-next-btn"],
                curMovieIdx ===
                  filterWithKeyword(data, stars, keyWord).length - 1 &&
                  style["detail-next-btn-hide"]
              )}
              onClick={() =>
                this.setState({ curMovieIdx: this.state.curMovieIdx + 1 })
              }
            >
              &gt;
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

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

export default App;
