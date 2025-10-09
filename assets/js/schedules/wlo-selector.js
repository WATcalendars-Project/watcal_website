// Wrapper for WLO that uses the unified group-selector implementation.
window.initGroupSelector({
  plansTemplate: 'https://plany.wlo.wat.edu.pl/zima/{group}.htm',
  calendarsPaths: 'db/calendars/wlo_calendars,db/calendars/wlo,db/wlo_calendars',
  schedulesPaths: 'db/schedules/wlo_schedules,db/calendars/wlo_schedules'
});