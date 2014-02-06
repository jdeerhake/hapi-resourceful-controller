var logger = {};


function log( level, data, msg ) {
  if( logger[level] ) {
    logger[level]( data, msg );
  }
}

function init(logAPI) {
  logger = logAPI;
}

log.init = init;

module.exports = log;
