const request = require("supertest");

describe("request", () => {
  const originalArgv = process.argv;
  const day = Math.floor(Math.random() * 30) + 1;
  const year = Math.floor(Math.random() * 24) + 2000;
  const now = new Date(`${day} Oct ${year}  23:24:00`);
  const originalDate = global.Date;
  const originalDateNow = global.Date.now;
  function mockNow() {
    global.Date = jest.fn().mockImplementation(() => now); // mock Date "new" constructor
    global.Date.now = jest.fn().mockReturnValue(now.valueOf()); // mock Date.now
  }
  let app, server;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    mockNow();
  });

  afterEach(() => {
    process.argv = originalArgv;
    global.Date = originalDate;
    global.Date.now = originalDateNow;
    server.close();
  });

  test("returns correct result", async () => {
    process.argv = process.argv.concat(["-t", "195", "-i", "100"]);
    const expected = `Зараз ${now.toUTCString()}.`;
    ({ app, server } = require("./server"));
    const response = await request(app)
      .get("/")
      .set("Accept", "application/json")
      .expect(200);
    expect(response.text).toEqual(expected);
  }, 2000);

  test("causes log to console with correct arguments and correct number of times when i is 100 and t is 395", async () => {
    const logSpy = jest.spyOn(console, "log");
    process.argv = process.argv.concat(["-t", "395", "-i", "100"]);
    ({ app, server } = require("./server"));
    await request(app).get("/").set("Accept", "application/json").expect(200);

    expect(logSpy).toHaveBeenCalledTimes(4);
    expect(logSpy.mock.calls[0][0]).toEqual("interval: 100 timeout: 395");
    expect(logSpy.mock.calls[1][0]).toEqual(now);
    expect(logSpy.mock.calls[2][0]).toEqual(now);
  }, 2000);

  test("causes log to console with correct arguments and correct number of times when i is 200 and t is 995", async () => {
    const logSpy = jest.spyOn(console, "log");
    process.argv = process.argv.concat(["-i", "200", "-t", "995"]);
    ({ app, server } = require("./server"));
    await request(app).get("/").set("Accept", "application/json").expect(200);

    expect(logSpy).toHaveBeenCalledTimes(5);
    expect(logSpy.mock.calls[0][0]).toEqual("interval: 200 timeout: 995");
    expect(logSpy.mock.calls[1][0]).toEqual(now);
    expect(logSpy.mock.calls[2][0]).toEqual(now);
    expect(logSpy.mock.calls[3][0]).toEqual(now);
    expect(logSpy.mock.calls[4][0]).toEqual(now);
  }, 2000);

  test("causes log to console with correct arguments and correct number of times when i is not set and t is 695", async () => {
    const logSpy = jest.spyOn(console, "log");
    process.argv = process.argv.concat(["-t", "695"]);
    ({ app, server } = require("./server"));
    await request(app).get("/").set("Accept", "application/json").expect(200);

    expect(logSpy).toHaveBeenCalledTimes(7);
    expect(logSpy.mock.calls[0][0]).toEqual("interval: 100 timeout: 695");
    expect(logSpy.mock.calls[1][0]).toEqual(now);
    expect(logSpy.mock.calls[2][0]).toEqual(now);
    expect(logSpy.mock.calls[3][0]).toEqual(now);
    expect(logSpy.mock.calls[4][0]).toEqual(now);
    expect(logSpy.mock.calls[5][0]).toEqual(now);
  }, 2000);

  test("causes log to console with correct arguments and correct number of times when t is not set and i is 200", async () => {
    const logSpy = jest.spyOn(console, "log");
    process.argv = process.argv.concat(["-i", "200"]);
    ({ app, server } = require("./server"));
    await request(app).get("/").set("Accept", "application/json").expect(200);

    expect(logSpy).toHaveBeenCalledTimes(4);
    expect(logSpy.mock.calls[0][0]).toEqual("interval: 200 timeout: 700");
    expect(logSpy.mock.calls[1][0]).toEqual(now);
    expect(logSpy.mock.calls[2][0]).toEqual(now);
    expect(logSpy.mock.calls[3][0]).toEqual(now);
  }, 2000);

  test("causes log to console with correct arguments when i and t are not set", async () => {
    const logSpy = jest.spyOn(console, "log");
    ({ app, server } = require("./server"));
    await request(app).get("/").set("Accept", "application/json").expect(200);

    expect(logSpy.mock.calls[0][0]).toEqual("interval: 100 timeout: 700");
    expect(logSpy.mock.calls[1][0]).toEqual(now);
    expect(logSpy.mock.calls[2][0]).toEqual(now);
    expect(logSpy.mock.calls[3][0]).toEqual(now);
    expect(logSpy.mock.calls[4][0]).toEqual(now);
    expect(logSpy.mock.calls[5][0]).toEqual(now);
    expect(logSpy.mock.calls[6][0]).toEqual(now);
  }, 2000);

  test("returns correct result after all correct logs", async () => {
    global.Date = originalDate;
    global.Date.now = originalDateNow;
    const nows = [
      new Date(`${day} Oct ${year}  23:25:00`),
      new Date(`${day} Oct ${year}  23:26:00`),
      new Date(`${day} Oct ${year}  23:27:00`),
      new Date(`${day} Oct ${year}  23:28:00`),
      new Date(`${day} Oct ${year}  23:29:00`),
      new Date(`${day} Oct ${year}  23:30:00`),
    ];
    global.Date = jest
      .fn()
      .mockImplementationOnce(() => now)
      .mockImplementationOnce(() => nows[0])
      .mockImplementationOnce(() => nows[1])
      .mockImplementationOnce(() => nows[2])
      .mockImplementationOnce(() => nows[3])
      .mockImplementationOnce(() => nows[4])
      .mockImplementationOnce(() => nows[5]);
    global.Date.now = jest
      .fn()
      .mockReturnValueOnce(now.valueOf())
      .mockReturnValueOnce(nows[0].valueOf())
      .mockReturnValueOnce(nows[1].valueOf())
      .mockReturnValueOnce(nows[2].valueOf())
      .mockReturnValueOnce(nows[3].valueOf())
      .mockReturnValueOnce(nows[4].valueOf())
      .mockReturnValueOnce(nows[5].valueOf());
    const expected = `Зараз ${nows[5].toUTCString()}.`;
    const logSpy = jest.spyOn(console, "log");
    ({ app, server } = require("./server"));
    const response = await request(app)
      .get("/")
      .set("Accept", "application/json")
      .expect(200);

    expect(logSpy.mock.calls[1][0]).toEqual(now);
    expect(logSpy.mock.calls[2][0]).toEqual(nows[0]);
    expect(logSpy.mock.calls[3][0]).toEqual(nows[1]);
    expect(logSpy.mock.calls[4][0]).toEqual(nows[2]);
    expect(logSpy.mock.calls[5][0]).toEqual(nows[3]);
    expect(logSpy.mock.calls[6][0]).toEqual(nows[4]);
    expect(response.text).toEqual(expected);
  }, 2000);
});
