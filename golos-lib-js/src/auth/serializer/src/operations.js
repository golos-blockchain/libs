
// This file is merge updated from steemd's js_operation_serializer program.
/*

./js_operation_serializer |
sed 's/void/future_extensions/g'|
sed 's/steemit_protocol:://g'|
sed 's/14static_variantIJNS_12fixed_stringINSt3__14pairIyyEEEEEEE/string/g'|
sed 's/steemit_future_extensions/future_extensions/g'|
sed 's/steemit_protocol_//g' > tmp.coffee

*/
// coffee tmp.coffee # fix errors until you see: `ChainTypes is not defined`

/*

   remove these 7 lines from tmp.coffee:

static_variant [
    pow2
    equihash_pow
] = static_variant [
    pow2
    equihash_pow
]

*/

// npm i -g decaffeinate
// decaffeinate tmp.coffee

// Merge tmp.js - See "Generated code follows" below

import types from "./types"
import SerializerImpl from "./serializer"

const {
    int16,
    uint8,
    uint16,
    uint32,
    uint64,
    string,
    fixed_string,
    string_binary,
    bytes,
    bool,
    array,
    static_variant,
    variant_object,
    map,
    set,
    public_key,
    time_point_sec,
    optional,
    asset,
    asset_16
} = types

const future_extensions = types.void
const hardfork_version_vote = types.void
const version = types.void

// Place-holder, their are dependencies on "operation" .. The final list of
// operations is not avialble until the very end of the generated code.
// See: operation.st_operations = ...
const operation = static_variant();
module.exports.operation = operation;

// For module.exports
const Serializer = function(operation_name, serilization_types_object) {
    const s = new SerializerImpl(operation_name, serilization_types_object);
    return module.exports[operation_name] = s;
}

const beneficiaries = new Serializer(
    "beneficiaries", {
        account: string,
        weight: uint16
    }
);

const comment_payout_beneficiaries = new Serializer(
    0, {
        beneficiaries: set(beneficiaries)
    }
);

const comment_auction_window_reward_destination = new Serializer(
    1, {
        destination: uint64
    }
);

const comment_curation_rewards_percent = new Serializer(
    2, {
        percent: uint16
    }
);

const comment_decrypt_fee = new Serializer(
    3, {
        fee: asset
    }
);

const account_referral = new Serializer(
    0, {
        referrer: string,
        interest_rate: uint16,
        end_date: time_point_sec,
        break_fee: asset
    }
);

const interest_direction = new Serializer(
    0, {
        is_emission: bool
    }
);

const transaction = new Serializer( 
    "transaction", {
        ref_block_num: uint16,
        ref_block_prefix: uint32,
        expiration: time_point_sec,
        operations: array(operation),
        extensions: set(future_extensions)
    }
);

const encrypted_memo = new Serializer(
    "encrypted_memo", {
        from: public_key,
        to: public_key,
        nonce: uint64,
        check: uint32,
        encrypted: string_binary
    }
);
// Custom-types after Generated code

// ##  Generated code follows
// -------------------------------
/*
When updating generated code (fix closing notation)
Replace:  var operation = static_variant([
with:     operation.st_operations = [

Delete (these are custom types instead):
let public_key = new Serializer( 
    "public_key",
    {key_data: bytes(33)}
);

let asset = new Serializer( 
    "asset",
    {amount: int64,
    symbol: uint64}
);

Replace: authority.prototype.account_authority_map
With: map((string), (uint16))
*/
let signed_transaction = new Serializer(
    "signed_transaction", {
        ref_block_num: uint16,
        ref_block_prefix: uint32,
        expiration: time_point_sec,
        operations: array(operation),
        extensions: set(future_extensions),
        signatures: array(bytes(65))
    }
);

let signed_block = new Serializer(
    "signed_block", {
        previous: bytes(20),
        timestamp: time_point_sec,
        witness: string,
        transaction_merkle_root: bytes(20),
        extensions: set(static_variant([
            future_extensions,    
            version,    
            hardfork_version_vote
        ])),
        witness_signature: bytes(65),
        transactions: array(signed_transaction)
    }
);

let block_header = new Serializer(
    "block_header", {
        previous: bytes(20),
        timestamp: time_point_sec,
        witness: string,
        transaction_merkle_root: bytes(20),
        extensions: set(static_variant([
            future_extensions,    
            version,    
            hardfork_version_vote
        ]))
    }
);

let signed_block_header = new Serializer(
    "signed_block_header", {
        previous: bytes(20),
        timestamp: time_point_sec,
        witness: string,
        transaction_merkle_root: bytes(20),
        extensions: set(static_variant([
            future_extensions,    
            version,    
            hardfork_version_vote
        ])),
        witness_signature: bytes(65)
    }
);

let vote = new Serializer(
    "vote", {
        voter: string,
        author: string,
        permlink: string,
        weight: int16
    }
);

let comment = new Serializer(
    "comment", {
        parent_author: string,
        parent_permlink: string,
        author: string,
        permlink: string,
        title: string,
        body: string,
        json_metadata: string
    }
);

let transfer = new Serializer(
    "transfer", {
        from: string,
        to: string,
        amount: asset,
        memo: string
    }
);

let transfer_to_vesting = new Serializer(
    "transfer_to_vesting", {
        from: string,
        to: string,
        amount: asset
    }
);

let withdraw_vesting = new Serializer(
    "withdraw_vesting", {
        account: string,
        vesting_shares: asset
    }
);

let limit_order_create = new Serializer(
    "limit_order_create", {
        owner: string,
        orderid: uint32,
        amount_to_sell: asset,
        min_to_receive: asset,
        fill_or_kill: bool,
        expiration: time_point_sec
    }
);

let limit_order_cancel = new Serializer(
    "limit_order_cancel", {
        owner: string,
        orderid: uint32
    }
);

let price = new Serializer(
    "price", {
        base: asset,
        quote: asset
    }
);

let feed_publish = new Serializer(
    "feed_publish", {
        publisher: string,
        exchange_rate: price
    }
);

let convert = new Serializer(
    "convert", {
        owner: string,
        requestid: uint32,
        amount: asset
    }
);

let authority = new Serializer(
    "authority", {
        weight_threshold: uint32,
        account_auths: map((string), (uint16)),
        key_auths: map((public_key), (uint16))
    }
);

let account_create = new Serializer(
    "account_create", {
        fee: asset,
        creator: string,
        new_account_name: fixed_string,
        owner: authority,
        active: authority,
        posting: authority,
        memo_key: public_key,
        json_metadata: string
    }
);

let account_update = new Serializer(
    "account_update", {
        account: string,
        owner: optional(authority),
        active: optional(authority),
        posting: optional(authority),
        memo_key: public_key,
        json_metadata: string
    }
);

let chain_properties = new Serializer(
    "chain_properties", {
        account_creation_fee: asset,
        maximum_block_size: uint32,
        sbd_interest_rate: uint16
    }
);

let witness_update = new Serializer(
    "witness_update", {
        owner: string,
        url: string,
        block_signing_key: public_key,
        props: chain_properties,
        fee: asset
    }
);

let account_witness_vote = new Serializer(
    "account_witness_vote", {
        account: string,
        witness: string,
        approve: bool
    }
);

let account_witness_proxy = new Serializer(
    "account_witness_proxy", {
        account: string,
        proxy: string
    }
);

let pow = new Serializer(
    "pow", {
        worker: public_key,
        input: bytes(32),
        signature: bytes(65),
        work: bytes(32)
    }
);

let custom = new Serializer(
    "custom", {
        required_auths: set(string),
        id: uint16,
        data: bytes()
    }
);

let report_over_production = new Serializer(
    "report_over_production", {
        reporter: string,
        first_block: signed_block_header,
        second_block: signed_block_header
    }
);

let delete_comment = new Serializer(
    "delete_comment", {
        author: string,
        permlink: string
    }
);

let custom_json = new Serializer(
    "custom_json", {
        required_auths: set(string),
        required_posting_auths: set(string),
        id: string,
        json: string
    }
);

let comment_options = new Serializer(
    "comment_options", {
        author: string,
        permlink: string,
        max_accepted_payout: asset,
        percent_steem_dollars: uint16,
        allow_votes: bool,
        allow_curation_rewards: bool,
        extensions: set(static_variant([
            comment_payout_beneficiaries,
            comment_auction_window_reward_destination,
            comment_curation_rewards_percent,
            comment_decrypt_fee,
        ]))
    }
);

let set_withdraw_vesting_route = new Serializer(
    "set_withdraw_vesting_route", {
        from_account: string,
        to_account: string,
        percent: uint16,
        auto_vest: bool
    }
);

let limit_order_create2 = new Serializer(
    "limit_order_create2", {
        owner: string,
        orderid: uint32,
        amount_to_sell: asset,
        exchange_rate: price,
        fill_or_kill: bool,
        expiration: time_point_sec
    }
);

let challenge_authority = new Serializer(
    "challenge_authority", {
        challenger: string,
        challenged: string,
        require_owner: bool
    }
);

let prove_authority = new Serializer(
    "prove_authority", {
        challenged: string,
        require_owner: bool
    }
);

let request_account_recovery = new Serializer(
    "request_account_recovery", {
        recovery_account: string,
        account_to_recover: string,
        new_owner_authority: authority,
        extensions: set(future_extensions)
    }
);

let recover_account = new Serializer(
    "recover_account", {
        account_to_recover: string,
        new_owner_authority: authority,
        recent_owner_authority: authority,
        extensions: set(future_extensions)
    }
);

let change_recovery_account = new Serializer(
    "change_recovery_account", {
        account_to_recover: string,
        new_recovery_account: string,
        extensions: set(future_extensions)
    }
);

let escrow_transfer = new Serializer(
    "escrow_transfer", {
        from: string,
        to: string,
        sbd_amount: asset,
        steem_amount: asset,
        escrow_id: uint32,
        agent: string,
        fee: asset,
        json_meta: string,
        ratification_deadline: time_point_sec,
        escrow_expiration: time_point_sec
    }
);

let escrow_dispute = new Serializer(
    "escrow_dispute", {
        from: string,
        to: string,
        agent: string,
        who: string,
        escrow_id: uint32
    }
);

let escrow_release = new Serializer(
    "escrow_release", {
        from: string,
        to: string,
        agent: string,
        who: string,
        receiver: string,
        escrow_id: uint32,
        sbd_amount: asset,
        steem_amount: asset
    }
);

let pow2_input = new Serializer(
    "pow2_input", {
        worker_account: string,
        prev_block: bytes(20),
        nonce: uint64
    }
);

let pow2 = new Serializer(
    "pow2", {
        input: pow2_input,
        pow_summary: uint32
    }
);

let equihash_proof = new Serializer(
    "equihash_proof", {
        n: uint32,
        k: uint32,
        seed: bytes(32),
        inputs: array(uint32)
    }
);

let equihash_pow = new Serializer(
    "equihash_pow", {
        input: pow2_input,
        proof: equihash_proof,
        prev_block: bytes(20),
        pow_summary: uint32
    }
);

let escrow_approve = new Serializer(
    "escrow_approve", {
        from: string,
        to: string,
        agent: string,
        who: string,
        escrow_id: uint32,
        approve: bool
    }
);

let transfer_to_savings = new Serializer(
    "transfer_to_savings", {
        from: string,
        to: string,
        amount: asset,
        memo: string
    }
);

let transfer_from_savings = new Serializer(
    "transfer_from_savings", {
        from: string,
        request_id: uint32,
        to: string,
        amount: asset,
        memo: string
    }
);

let cancel_transfer_from_savings = new Serializer(
    "cancel_transfer_from_savings", {
        from: string,
        request_id: uint32
    }
);

let custom_binary = new Serializer(
    "custom_binary", {
        required_owner_auths: set(string),
        required_active_auths: set(string),
        required_posting_auths: set(string),
        required_auths: array(authority),
        id: string,
        data: bytes()
    }
);

let decline_voting_rights = new Serializer(
    "decline_voting_rights", {
        account: string,
        decline: bool
    }
);

let reset_account = new Serializer(
    "reset_account", {
        reset_account: string,
        account_to_reset: string,
        new_owner_authority: authority
    }
);

let set_reset_account = new Serializer(
    "set_reset_account", {
        account: string,
        current_reset_account: string,
        reset_account: string
    }
);

let delegate_vesting_shares = new Serializer(
    "delegate_vesting_shares", {
        delegator: string,
        delegatee: string,
        vesting_shares: asset
  }
);
  
let account_create_with_delegation = new Serializer(
    "account_create_with_delegation", {
        fee: asset,
        delegation: asset,
        creator: string,
        new_account_name: fixed_string,
        owner: authority,
        active: authority,
        posting: authority,
        memo_key: public_key,
        json_metadata: string,
        extensions: set(static_variant([
            account_referral
        ]))
  }
);
  
let account_create_with_invite = new Serializer(
    "account_create_with_invite", {
        invite_secret: string,
        creator: string,
        new_account_name: fixed_string,
        owner: authority,
        active: authority,
        posting: authority,
        memo_key: public_key,
        json_metadata: string,
        extensions: set(future_extensions)
  }
);

let account_metadata = new Serializer(
    "account_metadata", {
        account: string,
        json_metadata: string
  }
);

let operation_wrapper = new Serializer(
    "operation_wrapper", {
        op: operation
  }
);
  
let proposal_create = new Serializer(
    "proposal_create", {
        author: string,
        title: string,
        memo: string,
        expiration_time: time_point_sec,
        proposed_operations: array(operation_wrapper),
        review_period_time: optional(time_point_sec),
        extensions: set(future_extensions)
  }
);
  
let proposal_update = new Serializer(
    "proposal_update", {
        author: string,
        title: string,
        active_approvals_to_add: set(string),
        active_approvals_to_remove: set(string),
        owner_approvals_to_add: set(string),
        owner_approvals_to_remove: set(string),
        posting_approvals_to_add: set(string),
        posting_approvals_to_remove: set(string),
        key_approvals_to_add: set(public_key),
        key_approvals_to_remove: set(public_key),
        extensions: set(future_extensions)
  }
);
  
let proposal_delete = new Serializer(
    "proposal_delete", {
        author: string,
        title: string,
        requester: string,
        extensions: set(future_extensions)
  }
);

let chain_properties_18 = new Serializer(
    1, {
        account_creation_fee: asset,
        maximum_block_size: uint32,
        sbd_interest_rate: uint16,
        create_account_min_golos_fee: asset,
        create_account_min_delegation: asset,
        create_account_delegation_time: uint32,
        min_delegation: asset
  }
);

let chain_properties_19 = new Serializer(
    2, {
        account_creation_fee: asset,
        maximum_block_size: uint32,
        sbd_interest_rate: uint16,
        create_account_min_golos_fee: asset,
        create_account_min_delegation: asset,
        create_account_delegation_time: uint32,
        min_delegation: asset,
        max_referral_interest_rate: uint16,
        max_referral_term_sec: uint32,
        min_referral_break_fee: asset,
        max_referral_break_fee: asset,
        posts_window: uint16,
        posts_per_window: uint16,
        comments_window: uint16,
        comments_per_window: uint16,
        votes_window: uint16,
        votes_per_window: uint16,
        auction_window_size: uint16,
        max_delegated_vesting_interest_rate: uint16,
        custom_ops_bandwidth_multiplier: uint16,
        min_curation_percent: uint16,
        max_curation_percent: uint16,
        curation_reward_curve: uint64,
        allow_distribute_auction_reward: bool,
        allow_return_auction_reward_to_fund: bool
  }
);

let chain_properties_22 = new Serializer(
    3, {
        account_creation_fee: asset,
        maximum_block_size: uint32,
        sbd_interest_rate: uint16,
        create_account_min_golos_fee: asset,
        create_account_min_delegation: asset,
        create_account_delegation_time: uint32,
        min_delegation: asset,
        max_referral_interest_rate: uint16,
        max_referral_term_sec: uint32,
        min_referral_break_fee: asset,
        max_referral_break_fee: asset,
        posts_window: uint16,
        posts_per_window: uint16,
        comments_window: uint16,
        comments_per_window: uint16,
        votes_window: uint16,
        votes_per_window: uint16,
        auction_window_size: uint16,
        max_delegated_vesting_interest_rate: uint16,
        custom_ops_bandwidth_multiplier: uint16,
        min_curation_percent: uint16,
        max_curation_percent: uint16,
        curation_reward_curve: uint64,
        allow_distribute_auction_reward: bool,
        allow_return_auction_reward_to_fund: bool,
        worker_reward_percent: uint16,
        witness_reward_percent: uint16,
        vesting_reward_percent: uint16,
        worker_request_creation_fee: asset,
        worker_request_approve_min_percent: uint16,
        sbd_debt_convert_rate: uint16,
        vote_regeneration_per_day: uint32,
        witness_skipping_reset_time: uint32,
        witness_idleness_time: uint32,
        account_idleness_time: uint32
  }
);

let chain_properties_23 = new Serializer(
  4, {
        account_creation_fee: asset,
        maximum_block_size: uint32,
        sbd_interest_rate: uint16,
        create_account_min_golos_fee: asset,
        create_account_min_delegation: asset,
        create_account_delegation_time: uint32,
        min_delegation: asset,
        max_referral_interest_rate: uint16,
        max_referral_term_sec: uint32,
        min_referral_break_fee: asset,
        max_referral_break_fee: asset,
        posts_window: uint16,
        posts_per_window: uint16,
        comments_window: uint16,
        comments_per_window: uint16,
        votes_window: uint16,
        votes_per_window: uint16,
        auction_window_size: uint16,
        max_delegated_vesting_interest_rate: uint16,
        custom_ops_bandwidth_multiplier: uint16,
        min_curation_percent: uint16,
        max_curation_percent: uint16,
        curation_reward_curve: uint64,
        allow_distribute_auction_reward: bool,
        allow_return_auction_reward_to_fund: bool,
        worker_reward_percent: uint16,
        witness_reward_percent: uint16,
        vesting_reward_percent: uint16,
        worker_request_creation_fee: asset,
        worker_request_approve_min_percent: uint16,
        sbd_debt_convert_rate: uint16,
        vote_regeneration_per_day: uint32,
        witness_skipping_reset_time: uint32,
        witness_idleness_time: uint32,
        account_idleness_time: uint32,
        claim_idleness_time: uint32,
        min_invite_balance: asset,
  }
);

let chain_properties_24 = new Serializer(
  5, {
        account_creation_fee: asset,
        maximum_block_size: uint32,
        sbd_interest_rate: uint16,
        create_account_min_golos_fee: asset,
        create_account_min_delegation: asset,
        create_account_delegation_time: uint32,
        min_delegation: asset,
        max_referral_interest_rate: uint16,
        max_referral_term_sec: uint32,
        min_referral_break_fee: asset,
        max_referral_break_fee: asset,
        posts_window: uint16,
        posts_per_window: uint16,
        comments_window: uint16,
        comments_per_window: uint16,
        votes_window: uint16,
        votes_per_window: uint16,
        auction_window_size: uint16,
        max_delegated_vesting_interest_rate: uint16,
        custom_ops_bandwidth_multiplier: uint16,
        min_curation_percent: uint16,
        max_curation_percent: uint16,
        curation_reward_curve: uint64,
        allow_distribute_auction_reward: bool,
        allow_return_auction_reward_to_fund: bool,
        worker_reward_percent: uint16,
        witness_reward_percent: uint16,
        vesting_reward_percent: uint16,
        worker_request_creation_fee: asset,
        worker_request_approve_min_percent: uint16,
        sbd_debt_convert_rate: uint16,
        vote_regeneration_per_day: uint32,
        witness_skipping_reset_time: uint32,
        witness_idleness_time: uint32,
        account_idleness_time: uint32,
        claim_idleness_time: uint32,
        min_invite_balance: asset,
        asset_creation_fee: asset,
        invite_transfer_interval_sec: uint32,
  }
);

let chain_properties_26 = new Serializer(
  6, {
        account_creation_fee: asset,
        maximum_block_size: uint32,
        sbd_interest_rate: uint16,
        create_account_min_golos_fee: asset,
        create_account_min_delegation: asset,
        create_account_delegation_time: uint32,
        min_delegation: asset,
        max_referral_interest_rate: uint16,
        max_referral_term_sec: uint32,
        min_referral_break_fee: asset,
        max_referral_break_fee: asset,
        posts_window: uint16,
        posts_per_window: uint16,
        comments_window: uint16,
        comments_per_window: uint16,
        votes_window: uint16,
        votes_per_window: uint16,
        auction_window_size: uint16,
        max_delegated_vesting_interest_rate: uint16,
        custom_ops_bandwidth_multiplier: uint16,
        min_curation_percent: uint16,
        max_curation_percent: uint16,
        curation_reward_curve: uint64,
        allow_distribute_auction_reward: bool,
        allow_return_auction_reward_to_fund: bool,
        worker_reward_percent: uint16,
        witness_reward_percent: uint16,
        vesting_reward_percent: uint16,
        worker_request_creation_fee: asset,
        worker_request_approve_min_percent: uint16,
        sbd_debt_convert_rate: uint16,
        vote_regeneration_per_day: uint32,
        witness_skipping_reset_time: uint32,
        witness_idleness_time: uint32,
        account_idleness_time: uint32,
        claim_idleness_time: uint32,
        min_invite_balance: asset,
        asset_creation_fee: asset,
        invite_transfer_interval_sec: uint32,
        convert_fee_percent: uint16,
        min_golos_power_to_curate: asset,
        worker_emission_percent: uint16,
        vesting_of_remain_percent: uint16,
        negrep_posting_window: uint16,
        negrep_posting_per_window: uint16,
  }
);

let chain_properties_27 = new Serializer(
  7, {
        account_creation_fee: asset,
        maximum_block_size: uint32,
        sbd_interest_rate: uint16,
        create_account_min_golos_fee: asset,
        create_account_min_delegation: asset,
        create_account_delegation_time: uint32,
        min_delegation: asset,
        max_referral_interest_rate: uint16,
        max_referral_term_sec: uint32,
        min_referral_break_fee: asset,
        max_referral_break_fee: asset,
        posts_window: uint16,
        posts_per_window: uint16,
        comments_window: uint16,
        comments_per_window: uint16,
        votes_window: uint16,
        votes_per_window: uint16,
        auction_window_size: uint16,
        max_delegated_vesting_interest_rate: uint16,
        custom_ops_bandwidth_multiplier: uint16,
        min_curation_percent: uint16,
        max_curation_percent: uint16,
        curation_reward_curve: uint64,
        allow_distribute_auction_reward: bool,
        allow_return_auction_reward_to_fund: bool,
        worker_reward_percent: uint16,
        witness_reward_percent: uint16,
        vesting_reward_percent: uint16,
        worker_request_creation_fee: asset,
        worker_request_approve_min_percent: uint16,
        sbd_debt_convert_rate: uint16,
        vote_regeneration_per_day: uint32,
        witness_skipping_reset_time: uint32,
        witness_idleness_time: uint32,
        account_idleness_time: uint32,
        claim_idleness_time: uint32,
        min_invite_balance: asset,
        asset_creation_fee: asset,
        invite_transfer_interval_sec: uint32,
        convert_fee_percent: uint16,
        min_golos_power_to_curate: asset,
        worker_emission_percent: uint16,
        vesting_of_remain_percent: uint16,
        negrep_posting_window: uint16,
        negrep_posting_per_window: uint16,
        unwanted_operation_cost: asset,
        unlimit_operation_cost: asset,
  }
);

let chain_properties_28 = new Serializer(
  8, {
        account_creation_fee: asset,
        maximum_block_size: uint32,
        sbd_interest_rate: uint16,
        create_account_min_golos_fee: asset,
        create_account_min_delegation: asset,
        create_account_delegation_time: uint32,
        min_delegation: asset,
        max_referral_interest_rate: uint16,
        max_referral_term_sec: uint32,
        min_referral_break_fee: asset,
        max_referral_break_fee: asset,
        posts_window: uint16,
        posts_per_window: uint16,
        comments_window: uint16,
        comments_per_window: uint16,
        votes_window: uint16,
        votes_per_window: uint16,
        auction_window_size: uint16,
        max_delegated_vesting_interest_rate: uint16,
        custom_ops_bandwidth_multiplier: uint16,
        min_curation_percent: uint16,
        max_curation_percent: uint16,
        curation_reward_curve: uint64,
        allow_distribute_auction_reward: bool,
        allow_return_auction_reward_to_fund: bool,
        worker_reward_percent: uint16,
        witness_reward_percent: uint16,
        vesting_reward_percent: uint16,
        worker_request_creation_fee: asset,
        worker_request_approve_min_percent: uint16,
        sbd_debt_convert_rate: uint16,
        vote_regeneration_per_day: uint32,
        witness_skipping_reset_time: uint32,
        witness_idleness_time: uint32,
        account_idleness_time: uint32,
        claim_idleness_time: uint32,
        min_invite_balance: asset,
        asset_creation_fee: asset,
        invite_transfer_interval_sec: uint32,
        convert_fee_percent: uint16,
        min_golos_power_to_curate: asset,
        worker_emission_percent: uint16,
        vesting_of_remain_percent: uint16,
        negrep_posting_window: uint16,
        negrep_posting_per_window: uint16,
        unwanted_operation_cost: asset,
        unlimit_operation_cost: asset,
        min_golos_power_to_emission: asset,
  }
);

let chain_properties_29 = new Serializer(
  9, {
        account_creation_fee: asset,
        maximum_block_size: uint32,
        sbd_interest_rate: uint16,
        create_account_min_golos_fee: asset,
        create_account_min_delegation: asset,
        create_account_delegation_time: uint32,
        min_delegation: asset,
        max_referral_interest_rate: uint16,
        max_referral_term_sec: uint32,
        min_referral_break_fee: asset,
        max_referral_break_fee: asset,
        posts_window: uint16,
        posts_per_window: uint16,
        comments_window: uint16,
        comments_per_window: uint16,
        votes_window: uint16,
        votes_per_window: uint16,
        auction_window_size: uint16,
        max_delegated_vesting_interest_rate: uint16,
        custom_ops_bandwidth_multiplier: uint16,
        min_curation_percent: uint16,
        max_curation_percent: uint16,
        curation_reward_curve: uint64,
        allow_distribute_auction_reward: bool,
        allow_return_auction_reward_to_fund: bool,
        worker_reward_percent: uint16,
        witness_reward_percent: uint16,
        vesting_reward_percent: uint16,
        worker_request_creation_fee: asset,
        worker_request_approve_min_percent: uint16,
        sbd_debt_convert_rate: uint16,
        vote_regeneration_per_day: uint32,
        witness_skipping_reset_time: uint32,
        witness_idleness_time: uint32,
        account_idleness_time: uint32,
        claim_idleness_time: uint32,
        min_invite_balance: asset,
        asset_creation_fee: asset,
        invite_transfer_interval_sec: uint32,
        convert_fee_percent: uint16,
        min_golos_power_to_curate: asset,
        worker_emission_percent: uint16,
        vesting_of_remain_percent: uint16,
        negrep_posting_window: uint16,
        negrep_posting_per_window: uint16,
        unwanted_operation_cost: asset,
        unlimit_operation_cost: asset,
        min_golos_power_to_emission: asset,
        nft_issue_cost: asset,
  }
);

let chain_properties_30 = new Serializer(
  10, {
        account_creation_fee: asset,
        maximum_block_size: uint32,
        sbd_interest_rate: uint16,
        create_account_min_golos_fee: asset,
        create_account_min_delegation: asset,
        create_account_delegation_time: uint32,
        min_delegation: asset,
        max_referral_interest_rate: uint16,
        max_referral_term_sec: uint32,
        min_referral_break_fee: asset,
        max_referral_break_fee: asset,
        posts_window: uint16,
        posts_per_window: uint16,
        comments_window: uint16,
        comments_per_window: uint16,
        votes_window: uint16,
        votes_per_window: uint16,
        auction_window_size: uint16,
        max_delegated_vesting_interest_rate: uint16,
        custom_ops_bandwidth_multiplier: uint16,
        min_curation_percent: uint16,
        max_curation_percent: uint16,
        curation_reward_curve: uint64,
        allow_distribute_auction_reward: bool,
        allow_return_auction_reward_to_fund: bool,
        worker_reward_percent: uint16,
        witness_reward_percent: uint16,
        vesting_reward_percent: uint16,
        worker_request_creation_fee: asset,
        worker_request_approve_min_percent: uint16,
        sbd_debt_convert_rate: uint16,
        vote_regeneration_per_day: uint32,
        witness_skipping_reset_time: uint32,
        witness_idleness_time: uint32,
        account_idleness_time: uint32,
        claim_idleness_time: uint32,
        min_invite_balance: asset,
        asset_creation_fee: asset,
        invite_transfer_interval_sec: uint32,
        convert_fee_percent: uint16,
        min_golos_power_to_curate: asset,
        worker_emission_percent: uint16,
        vesting_of_remain_percent: uint16,
        negrep_posting_window: uint16,
        negrep_posting_per_window: uint16,
        unwanted_operation_cost: asset,
        unlimit_operation_cost: asset,
        min_golos_power_to_emission: asset,
        nft_issue_cost: asset,
        private_group_golos_power: asset,
        private_group_cost: asset,
  }
);

let chain_properties_update = new Serializer(
    "chain_properties_update", {
        owner: string,
        props: static_variant([
            chain_properties,
            chain_properties_18,
            chain_properties_19,
            chain_properties_22,
            chain_properties_23,
            chain_properties_24,
            chain_properties_26,
            chain_properties_27,
            chain_properties_28,
            chain_properties_29,
            chain_properties_30,
        ])
  }
);

let break_free_referral = new Serializer(
    "break_free_referral", {
        referral: string,
        extensions: set(future_extensions)
    }
);
  
let delegate_vesting_shares_with_interest = new Serializer(
    "delegate_vesting_shares_with_interest", {
        delegator: string,
        delegatee: string,
        vesting_shares: asset,
        interest_rate: uint16,
        extensions: set(static_variant([
            interest_direction
        ]))
    }
);
  
let reject_vesting_shares_delegation = new Serializer(
    "reject_vesting_shares_delegation", {
        delegator: string,
        delegatee: string,
        extensions: set(future_extensions)
    }
);

let transit_to_cyberway = new Serializer(
    "transit_to_cyberway", {
        owner: string,
        vote_to_transit: bool
    }
);

let worker_request = new Serializer(
    "worker_request", {
        author: string,
        permlink: string,
        worker: string,
        required_amount_min: asset,
        required_amount_max: asset,
        vest_reward: bool,
        duration: uint32,
        extensions: set(future_extensions)
    }
);

let worker_request_delete = new Serializer(
    "worker_request_delete", {
        author: string,
        permlink: string,
        extensions: set(future_extensions)
    }
);

let worker_request_vote = new Serializer(
    "worker_request_vote", {
        voter: string,
        author: string,
        permlink: string,
        vote_percent: int16,
        extensions: set(future_extensions)
    }
);

let claim = new Serializer(
    "claim", {
        from: string,
        to: string,
        amount: asset,
        to_vesting: bool,
        extensions: set(future_extensions)
    }
);

let donate_memo = new Serializer(
    "donate_memo", {
        app: string,
        version: uint16,
        target: types.variant_object,
        comment: optional(string)
    }
);

let donate = new Serializer(
    "donate", {
        from: string,
        to: string,
        amount: asset,
        memo: donate_memo,
        extensions: set(future_extensions)
    }
);

let transfer_to_tip = new Serializer(
    "transfer_to_tip", {
        from: string,
        to: string,
        amount: asset,
        memo: string,
        extensions: set(future_extensions)
    }
);

let transfer_from_tip = new Serializer(
    "transfer_from_tip", {
        from: string,
        to: string,
        amount: asset,
        memo: string,
        extensions: set(future_extensions)
    }
);

const is_invite_referral = new Serializer(
    0, {
        is_referral: bool
    }
);

let invite = new Serializer(
    "invite", {
        creator: string,
        balance: asset,
        invite_key: public_key,
        extensions: set(static_variant([
            is_invite_referral
        ]))
    }
);

let invite_claim = new Serializer(
    "invite_claim", {
        initiator: string,
        receiver: string,
        invite_secret: string,
        extensions: set(future_extensions)
    }
);

let asset_create = new Serializer(
    "asset_create", {
        creator: string,
        max_supply: asset,
        allow_fee: bool,
        allow_override_transfer: bool,
        json_metadata: string,
        extensions: set(future_extensions)
    }
);

let asset_update = new Serializer(
    "asset_update", {
        creator: string,
        symbol: string,
        symbols_whitelist: set(string),
        fee_percent: uint16,
        json_metadata: string,
        extensions: set(future_extensions)
    }
);

let asset_issue = new Serializer(
    "asset_issue", {
        creator: string,
        amount: asset,
        to: string,
        extensions: set(future_extensions)
    }
);

let asset_transfer = new Serializer(
    "asset_transfer", {
        creator: string,
        symbol: string,
        new_owner: string,
        extensions: set(future_extensions)
    }
);

let override_transfer = new Serializer(
    "override_transfer", {
        creator: string,
        from: string,
        to: string,
        amount: asset,
        memo: string,
        extensions: set(future_extensions)
    }
);

let invite_donate = new Serializer(
    "invite_donate", {
        from: string,
        invite_key: public_key,
        amount: asset,
        memo: string,
        extensions: set(future_extensions)
    }
);

let invite_transfer = new Serializer(
    "invite_transfer", {
        from: public_key,
        to: public_key,
        amount: asset,
        memo: string,
        extensions: set(future_extensions)
    }
);

const pair_to_cancel = new Serializer(
    0, {
        base: string,
        quote: string,
        reverse: bool,
    }
);

let limit_order_cancel_ex = new Serializer(
    "limit_order_cancel_ex", {
        owner: string,
        orderid: uint32,
        extensions: set(static_variant([
            pair_to_cancel
        ]))
    }
);

const account_block_setting = new Serializer(
    0, {
        account: string,
        block: bool,
    }
);

const do_not_bother_setting = new Serializer(
    1, {
        do_not_bother: bool,
    }
);

let account_setup = new Serializer(
    "account_setup", {
        account: string,
        settings: set(static_variant([
            account_block_setting,
            do_not_bother_setting
        ])),
        extensions: set(future_extensions)
    }
);

let paid_subscription_id = new Serializer(
    "paid_subscription_id", {
        app: string,
        name: string,
        version: uint16,
    }
);

let paid_subscription_create = new Serializer(
    "paid_subscription_create", {
        author: string,
        oid: paid_subscription_id,
        cost: asset,
        tip_cost: bool,
        allow_prepaid: bool,
        interval: uint32,
        executions: uint32,
        extensions: set(future_extensions)
    }
);

let paid_subscription_update = new Serializer(
    "paid_subscription_update", {
        author: string,
        oid: paid_subscription_id,
        cost: asset,
        tip_cost: bool,
        interval: uint32,
        executions: uint32,
        extensions: set(future_extensions)
    }
);

let paid_subscription_delete = new Serializer(
    "paid_subscription_delete", {
        author: string,
        oid: paid_subscription_id,
        extensions: set(future_extensions)
    }
);

let paid_subscription_transfer = new Serializer(
    "paid_subscription_transfer", {
        from: string,
        to: string,
        oid: paid_subscription_id,
        amount: asset,
        memo: string,
        from_tip: bool,
        extensions: set(future_extensions)
    }
);

let paid_subscription_cancel = new Serializer(
    "paid_subscription_cancel", {
        subscriber: string,
        author: string,
        oid: paid_subscription_id,
        extensions: set(future_extensions)
    }
);

let nft_collection = new Serializer(
    "nft_collection", {
        creator: string,
        name: string,
        json_metadata: string,
        max_token_count: uint32,
        extensions: set(future_extensions)
    }
);

let nft_collection_delete = new Serializer(
    "nft_collection_delete", {
        creator: string,
        name: string,
        extensions: set(future_extensions)
    }
);

let nft_issue = new Serializer(
    "nft_issue", {
        creator: string,
        name: string,
        to: string,
        json_metadata: string,
        extensions: set(future_extensions)
    }
);

let nft_transfer = new Serializer(
    "nft_transfer", {
        token_id: uint32,
        from: string,
        to: string,
        memo: string,
        extensions: set(future_extensions)
    }
);

let nft_sell = new Serializer(
    "nft_sell", {
        seller: string,
        token_id: uint32,
        buyer: string,
        order_id: uint32,
        price: asset,
        extensions: set(future_extensions)
    }
);

let nft_buy = new Serializer(
    "nft_buy", {
        buyer: string,
        name: string,
        token_id: uint32,
        order_id: uint32,
        price: asset,
        extensions: set(future_extensions)
    }
);

let nft_cancel_order = new Serializer(
    "nft_cancel_order", {
        owner: string,
        order_id: uint32,
        extensions: set(future_extensions)
    }
);

let nft_auction = new Serializer(
    "nft_auction", {
        owner: string,
        token_id: uint32,
        min_price: asset,
        expiration: time_point_sec,
        extensions: set(future_extensions)
    }
);

let fill_convert_request = new Serializer(
    "fill_convert_request", {
        owner: string,
        requestid: uint32,
        amount_in: asset,
        amount_out: asset
    }
);

let author_reward = new Serializer(
    "author_reward", {
        author: string,
        permlink: string,
        sbd_payout: asset,
        steem_payout: asset,
        vesting_payout: asset
    }
);

let curation_reward = new Serializer(
    "curation_reward", {
        curator: string,
        reward: asset,
        comment_author: string,
        comment_permlink: string
    }
);

let comment_reward = new Serializer(
    "comment_reward", {
        author: string,
        permlink: string,
        payout: asset
    }
);

let liquidity_reward = new Serializer(
    "liquidity_reward", {
        owner: string,
        payout: asset
    }
);

let interest = new Serializer(
    "interest", {
        owner: string,
        interest: asset
    }
);

let fill_vesting_withdraw = new Serializer(
    "fill_vesting_withdraw", {
        from_account: string,
        to_account: string,
        withdrawn: asset,
        deposited: asset
    }
);

let fill_order = new Serializer(
    "fill_order", {
        current_owner: string,
        current_orderid: uint32,
        current_pays: asset,
        current_trade_fee: asset,
        current_trade_fee_receiver: string,
        open_owner: string,
        open_orderid: uint32,
        open_pays: asset,
        open_trade_fee: asset,
        open_trade_fee_receiver: string
    }
);

let shutdown_witness = new Serializer(
    "shutdown_witness", {
        owner: string
    }
);

let fill_transfer_from_savings = new Serializer(
    "fill_transfer_from_savings", {
        from: string,
        to: string,
        amount: asset,
        request_id: uint32,
        memo: string
    }
);

let hardfork = new Serializer(
    "hardfork", {
        hardfork_id: uint32
    }
);

let comment_payout_update = new Serializer(
    "comment_payout_update", {
        author: string,
        permlink: string
    }
);

let comment_benefactor_reward = new Serializer(
    "comment_benefactor_reward", {
        benefactor: string,
        author: string,
        permlink: string,
        reward: asset
  }
);
  
let return_vesting_delegation = new Serializer(
    "return_vesting_delegation", {
        account: string,
        vesting_shares: asset
  }
);

operation.st_operations = [
    vote,
    comment,
    transfer,
    transfer_to_vesting,
    withdraw_vesting,
    limit_order_create,
    limit_order_cancel,
    feed_publish,
    convert,
    account_create, 
    account_update,
    witness_update,
    account_witness_vote,
    account_witness_proxy,
    pow,
    custom,
    report_over_production,
    delete_comment,
    custom_json,
    comment_options,
    set_withdraw_vesting_route,
    limit_order_create2,
    challenge_authority,
    prove_authority,
    request_account_recovery,
    recover_account,
    change_recovery_account,
    escrow_transfer,
    escrow_dispute,
    escrow_release,
    pow2,
    escrow_approve,
    transfer_to_savings,
    transfer_from_savings,
    cancel_transfer_from_savings,
    custom_binary,
    decline_voting_rights,
    reset_account,
    set_reset_account,
    delegate_vesting_shares,
    account_create_with_delegation,
    account_metadata,
    proposal_create,
    proposal_update,
    proposal_delete,
    chain_properties_update,
    break_free_referral,
    delegate_vesting_shares_with_interest,
    reject_vesting_shares_delegation,
    transit_to_cyberway,
    worker_request,
    worker_request_delete,
    worker_request_vote,
    claim,
    donate,
    transfer_to_tip,
    transfer_from_tip,
    invite,
    invite_claim,
    account_create_with_invite,
    asset_create,
    asset_update,
    asset_issue,
    asset_transfer,
    override_transfer,
    invite_donate,
    invite_transfer,
    limit_order_cancel_ex,
    account_setup,
    paid_subscription_create,
    paid_subscription_update,
    paid_subscription_delete,
    paid_subscription_transfer,
    paid_subscription_cancel,
    nft_collection,
    nft_collection_delete,
    nft_issue,
    nft_transfer,
    nft_sell,
    nft_buy,
    nft_cancel_order,
    nft_auction,

    fill_convert_request,
    author_reward,
    curation_reward,
    comment_reward,
    liquidity_reward,
    interest,
    fill_vesting_withdraw,
    fill_order,
    shutdown_witness,
    fill_transfer_from_savings,
    hardfork,
    comment_payout_update,
    comment_benefactor_reward,
    return_vesting_delegation,
];

//# -------------------------------
//#  Generated code end  S T O P
//# -------------------------------

// Make sure all tests pass
// npm test
