import morgan from "morgan";

const middleware = morgan("combined");

export { middleware as morgan };
