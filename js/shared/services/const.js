myApp.constant("CONST", {
    quality: {
        good: 'good',	// quick response
        avg:  'avg',		// average response time
        bad:  'bad',		// long response time
        fail: 'fail',	// site unavailable!
        none: 'none'	// not applicable
    },
    quality_good_treshold: 500,         // requests faster than this are 'good'
    quality_avg_treshold: 2000,         // requests faster than this are 'average'
    notify_progress_interval_ms: 4000,
    notify_progress_prolongation_ms: 12000
});
