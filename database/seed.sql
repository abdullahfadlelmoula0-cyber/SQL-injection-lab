-- AUTHORIZED CYBERSECURITY TRAINING LAB
-- 100% fictional demo accounts. None of this represents a real person or system.

INSERT INTO users (username, password, role, student_id, department, academic_year) VALUES
  ('admin',   'SuperSecret_Demo123',  'admin',   'ADM-0001', 'Administration',        'N/A'),
  ('alice',   'alicepw',              'student', 'STU-1001', 'Computer Science',      'Year 2'),
  ('bob',     'bobpw',                'student', 'STU-1002', 'Mathematics',           'Year 3'),
  ('charlie', 'charliepw',            'student', 'STU-1003', 'Physics',               'Year 1'),
  ('dana',    'danapw',               'student', 'STU-1004', 'Computer Science',      'Year 4'),
  ('erin',    'erinpw',               'faculty', 'FAC-2001', 'Computer Science',      'N/A'),
  ('frank',   'frankpw',              'student', 'STU-1005', 'Cybersecurity Studies', 'Year 2'),
  ('hidden_record', 'not-shown-normally', 'student', 'STU-9999', 'Confidential Research Unit (demo)', 'Year 3');
