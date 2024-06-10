import {
  vi,
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
} from "vitest";
import {
  searchShowsByTerm,
  getEpisodesOfShow,
  MISSING_IMAGE_URL,
  TVMAZE_API_URL,
} from "./models";
import { mockServer, mock } from "./apiMock.js";

beforeAll(function () { mockServer.listen(); });
afterEach(function () { mockServer.resetHandlers(); });
afterAll(function () { mockServer.close(); });

describe("searchShowsByTerm", function () {
  const data = [
    {
      show: { id: 1, name: "A", summary: "B", image: { medium: "img" } },
      score: 1,
    }, {
      show: { id: 2, name: "C", summary: "D" },
      score: 1,
    },
  ];
  const expected = [
    { id: 1, name: "A", summary: "B", image: "img" },
    { id: 2, name: "C", summary: "D", image: MISSING_IMAGE_URL },
  ];

  test("ok", async function () {
    mock("get", `${ TVMAZE_API_URL }search/shows?q=dog`, data);
    const resp = await searchShowsByTerm("dog");
    expect(resp).toEqual(expected);
  });

  test("nothing found", async function () {
    mock("get", `${ TVMAZE_API_URL }search/shows?q=dog`, []);
    const resp = await searchShowsByTerm("dog");
    expect(resp).toEqual([]);
  });
});

describe("getEpisodesOfShow", function () {
  test("ok", async function () {
    const data = [
      { id: 1, name: "Pilot", season: 1, number: 1 },
      { id: 2, name: "Second", season: 1, number: 2 },
    ];
    mock("get", `${ TVMAZE_API_URL }shows/1/episodes`, data);
    const resp = await getEpisodesOfShow(1);
    expect(resp).toEqual([
      { id: 1, name: "Pilot", season: 1, number: 1 },
      { id: 2, name: "Second", season: 1, number: 2 },
    ]);
  });
  test("ok - real", async function () {
    mockServer.resetHandlers();
    const resp = await getEpisodesOfShow(1);
    expect(resp[0]).toEqual({ id: 1, name: "Pilot", season: 1, number: 1 });
  });
});