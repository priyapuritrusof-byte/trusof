# Security Specification: Trusof Matrimony Firestore Security rules (TDD Spec)

This document delineates the data invariants, 12 destructive adversarial payloads designed to compromise Identity, Integrity, and State in our Matrimonial application, and verifies the access control expectations.

## 1. Data Invariants
1. **Profile Integrity**: A profile cannot write an arbitrary `id` from the client; the document ID must match the schema properties, and only its registered creator (`ownerId == request.auth.uid`) can edit or update details.
2. **Contact PII Confidentiality**: A candidate's direct `phone` and `email` contact are strictly contained in the isolated subcollection `/profiles/{profileId}/private/contact`. Only verified, signed-in users can read this sensitive data. Any unauthenticated/public read is strictly blocked.
3. **Interest Mutability**: A user can only express interest (`interests`) in their own name (`senderId == request.auth.uid`). They cannot modify a sent interest status unless they are the designated recipient of that interest (`receiverId == request.auth.uid` for accept/decline action) or updating their own `status` under strict transition rules.
4. **Shortlist Ownership**: A user can only shortlist a profile under their own UID (`userId == request.auth.uid`).
5. **Conversation/Chat Enclosure**: Chat rooms (`conversations`) and subcollection chats (`messages`) can only be read, created, or appended into by users who are listed in the `participants` array of that conversation.

---

## 2. The "Dirty Dozen" Adversarial Payloads
Here are the 12 adversarial JSON payloads designed to penetrate the system, all of which must return `PERMISSION_DENIED`.

### Attack 1: Profile Identity Spoofing (Owner Hijacking)
*   **Target Path**: `/profiles/target_id`
*   **Adversarial Payload**: Creating or updating a profile with a spoofed `ownerId` of another victim user.
*   **Payload JSON**:
    ```json
    {
      "id": "target_id",
      "name": "Attacker Spoof",
      "gender": "Female",
      "age": 25,
      "height": "5'5\"",
      "religion": "Hindu",
      "caste": "Sharma",
      "motherTongue": "Hindi",
      "location": "Mumbai",
      "education": "B.Tech",
      "occupation": "Hacker",
      "income": "24 LPA",
      "avatar": "https://example.com/hacker.jpg",
      "bio": "Spoofing owner...",
      "ownerId": "victim_uid_abc123",
      "createdAt": "2026-06-07T13:19:36Z",
      "updatedAt": "2026-06-07T13:19:36Z"
    }
    ```

### Attack 2: Unauthenticated Profile Creation (Anonymous Scraping)
*   **Target Path**: `/profiles/anon_id_999`
*   **Adversarial Payload**: Creating a matrimonial listing without signing in.
*   **Payload JSON**: Any Profile payload without authentication.

### Attack 3: Privilege Escalation (Self-Assigned Verification Rank badge)
*   **Target Path**: `/profiles/member_id_123`
*   **Adversarial Payload**: A non-admin user updating their own profile to set `verified: true` and `premium: true` autonomously.
*   **Payload JSON**:
    ```json
    {
      "verified": true,
      "premium": true
    }
    ```

### Attack 4: PII Contact Scraper Attack (Direct Read)
*   **Target Path**: `/profiles/candidate_456/private/contact`
*   **Adversarial Payload**: Reading contact details without being signed in.
*   **Payload JSON**: Public direct `get` on private subcollection.

### Attack 5: Contact Identity Spoofing (Writing to another's contact details)
*   **Target Path**: `/profiles/candidate_456/private/contact`
*   **Adversarial Payload**: Writing custom phone details to another candidate's private partition.
*   **Payload JSON**:
    ```json
    {
      "id": "candidate_456",
      "phone": "+91 99999 99999",
      "email": "hacked@example.com",
      "ownerId": "attacker_id"
    }
    ```

### Attack 6: Interest Identity Forgery (Sending in another user's name)
*   **Target Path**: `/interests/convo_777`
*   **Adversarial Payload**: Forging `senderId` to lock another user as showing interest.
*   **Payload JSON**:
    ```json
    {
      "id": "convo_777",
      "senderId": "innocent_victim_uid",
      "receiverId": "candidate_456",
      "status": "pending",
      "createdAt": "2026-06-07T13:19:36Z",
      "updatedAt": "2026-06-07T13:19:36Z"
    }
    ```

### Attack 7: Interest Status Cheat (Unilateral Self-Acceptance)
*   **Target Path**: `/interests/myUid_recipientUid`
*   **Adversarial Payload**: The *sender* tries to unilaterally update the interest status to `accepted` themselves.
*   **Payload JSON**:
    ```json
    {
      "status": "accepted",
      "updatedAt": "2026-06-07T13:19:36Z"
    }
    ```

### Attack 8: Shortlist Theft (Pinning as another user)
*   **Target Path**: `/shortlists/pin_888`
*   **Adversarial Payload**: Creating a shortlist item under another user's UID.
*   **Payload JSON**:
    ```json
    {
      "id": "pin_888",
      "userId": "victim_uid",
      "profileId": "candidate_456",
      "createdAt": "2026-06-07T13:19:36Z"
    }
    ```

### Attack 9: Chat Eavesdropping (Reading un-owned conversations)
*   **Target Path**: `/conversations/alice_bob`
*   **Adversarial Payload**: Reading conversation details when the user's UID is not part of `participants`.
*   **Payload JSON**: Direct read on `/conversations/alice_bob` by `attacker_uid`.

### Attack 10: Message Injection (Chat Spoofing)
*   **Target Path**: `/conversations/alice_bob/messages/fake_msg`
*   **Adversarial Payload**: Writing a chat message where `senderId` is spoofed as the other user.
*   **Payload JSON**:
    ```json
    {
      "id": "fake_msg",
      "senderId": "alice_uid",
      "receiverId": "bob_uid",
      "text": "Simulated forged text message...",
      "timestamp": "2026-06-07T13:19:36Z"
    }
    ```

### Attack 11: Billing bypass status hijack (Self UserPrivate Promotion)
*   **Target Path**: `/users/my_user_uid/private/info`
*   **Adversarial Payload**: Editing account properties to upgrade premium status without server verification.
*   **Payload/Operation**: Client-side overwrite setting `isPremium` to `true`.

### Attack 12: Injection of Massive Payload Strings (Denial of Wallet)
*   **Target Path**: `/profiles/attacker_profile`
*   **Adversarial Payload**: Setting a text field like `name` or `bio` with an unconstrained 10MB JSON string to increase storage/bandwidth billing.
*   **Payload JSON**:
    ```json
    {
      "id": "attacker_profile",
      "name": "A".repeat(10000000),
      ...
    }
    ```

---

## 3. Test Specification Checklist
All tests defined above must return `PERMISSION_DENIED` under all circumstances to satisfy the security specification criteria. Rules are strictly designed to filter out and intercept these requests.
