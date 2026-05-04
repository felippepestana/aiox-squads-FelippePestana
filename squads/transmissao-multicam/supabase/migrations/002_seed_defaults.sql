-- Seed default rows so settings pages render immediately without empty states.
-- Safe to re-run (INSERT ... ON CONFLICT DO NOTHING).

INSERT INTO obs_settings (host, port, use_tls)
VALUES ('localhost', 4455, false)
ON CONFLICT DO NOTHING;

INSERT INTO meet_settings (auto_record, studio_effects_disabled, live_streaming_enabled, max_participants)
VALUES (true, true, false, 300)
ON CONFLICT DO NOTHING;

INSERT INTO camera_configs (camera_id, display_name, vid, role, preset_1_name, preset_2_name, preset_3_name, auto_track)
VALUES
  ('CAM1', 'Câmera 1 — Palestrante',  '3564', 'speaker', 'wide', 'medium', 'close', true),
  ('CAM2', 'Câmera 2 — Host',         '3564', 'host',    'wide', 'medium', 'close', true),
  ('CAM3', 'Câmera 3 — Slides/Lousa', '3564', 'slides',  'wide', 'close',  'close', false),
  ('CAM4', 'Câmera 4 — Reserva',      '3564', 'reserve', 'wide', 'medium', 'close', true)
ON CONFLICT (camera_id) DO NOTHING;

INSERT INTO mic_channels (channel, label, input_name, camera_id, role, threshold_db)
VALUES
  (1, 'Mic Palestrante', 'Mic Palestrante', 'CAM1', 'speaker', -40),
  (2, 'Mic Host',        'Mic Host',        'CAM2', 'host',    -40),
  (3, 'Mic Aux',         'Mic Aux',         null,   'aux',     -35)
ON CONFLICT DO NOTHING;
