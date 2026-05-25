"""Tests for the metrics exporter."""

from __future__ import annotations

from auto_switch.metrics import Metrics


def test_records_switches_per_target():
    m = Metrics()
    m.record_switch("CAM1")
    m.record_switch("CAM2")
    m.record_switch("CAM2")
    assert m.switches_total == 3
    assert m.switches_by_target == {"CAM1": 1, "CAM2": 2}


def test_pingpong_detects_immediate_reverse():
    m = Metrics()
    m.record_switch("CAM1")
    m.record_switch("CAM2")
    m.record_switch("CAM1")  # reverses previous-but-one (CAM1)
    assert m.pingpong_total == 1


def test_pingpong_does_not_count_no_reverse():
    m = Metrics()
    m.record_switch("CAM1")
    m.record_switch("CAM2")
    m.record_switch("CAM3")
    assert m.pingpong_total == 0


def test_render_prometheus_format():
    m = Metrics()
    m.record_switch("CAM1")
    m.record_override()
    m.record_failover()
    m.record_motion_trigger()
    text = m.render_prometheus()
    assert "tx_multicam_switches_total 1" in text
    assert "tx_multicam_overrides_total 1" in text
    assert "tx_multicam_failovers_total 1" in text
    assert "tx_multicam_motion_triggers_total 1" in text
    assert 'tx_multicam_switches_by_target{target="CAM1"} 1' in text
