import { consoleColors } from '../constants/consoleColors';

const logger = {
  info: (message) => console.log(consoleColors.fgCyan, message, consoleColors.reset),
  danger: (message) => console.log(consoleColors.fgRed, message, consoleColors.reset),
  success: (message) => console.log(consoleColors.fgGreen, message, consoleColors.reset),
  warning: (message) => console.log(consoleColors.fgYellow, message, consoleColors.reset),
};

export { logger };
