// Wrapper for WIM that uses the unified group-selector implementation.
window.initGroupSelector({
  plansTemplate: 'https://plany.wim.wat.edu.pl/zima/{group}.htm',
  calendarsPaths: 'db/calendars/wim_calendars,db/calendars/wim,db/wim_calendars',
  schedulesPaths: 'db/schedules/wim_schedules,db/calendars/wim_schedules'
});