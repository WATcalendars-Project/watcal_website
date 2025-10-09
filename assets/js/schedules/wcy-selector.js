// Wrapper for WCY that uses the unified group-selector implementation.
window.initGroupSelector({
  plansTemplate: 'https://planzajec.wcy.wat.edu.pl/pl/rozklad?grupa_id={group}',
  calendarsPaths: 'db/calendars/wcy_calendars,db/calendars/wcy,db/wcy_calendars',
  schedulesPaths: 'db/schedules/wcy_schedules,db/calendars/wcy_schedules'
});