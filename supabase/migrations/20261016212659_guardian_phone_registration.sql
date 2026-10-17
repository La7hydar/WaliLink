CREATE POLICY guardian_registration_read_by_verified_phone ON public.guardians
  FOR SELECT TO authenticated
  USING (
    auth_user_id = (SELECT auth.uid())
    OR (
      auth_user_id IS NULL
      AND phone_number = (SELECT auth.jwt() ->> 'phone')
    )
  );

CREATE POLICY guardian_registration_read_children_by_verified_phone ON public.students
  FOR SELECT TO authenticated
  USING (
    guardian_id IN (
      SELECT g.id
      FROM public.guardians AS g
      WHERE g.auth_user_id = (SELECT auth.uid())
         OR (
           g.auth_user_id IS NULL
           AND g.phone_number = (SELECT auth.jwt() ->> 'phone')
         )
    )
  );

REVOKE UPDATE ON TABLE public.guardians FROM anon, authenticated;
GRANT UPDATE (auth_user_id) ON TABLE public.guardians TO authenticated;

CREATE POLICY guardian_registration_link_verified_phone ON public.guardians
  FOR UPDATE TO authenticated
  USING (
    auth_user_id IS NULL
    AND phone_number = (SELECT auth.jwt() ->> 'phone')
  )
  WITH CHECK (
    auth_user_id = (SELECT auth.uid())
    AND phone_number = (SELECT auth.jwt() ->> 'phone')
  );