// Wrapper for IOE that uses the unified group-selector implementation.
window.initGroupSelector({
  plansTemplate: 'https://ioe.wat.edu.pl/plany/lato/{group}.htm',
  calendarsPaths: 'db/calendars/ioe_calendars,db/calendars/ioe,db/ioe_calendars',
  schedulesPaths: 'db/schedules/ioe_schedules,db/calendars/ioe_schedules'
});