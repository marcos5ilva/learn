import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { GQLAuthGuard } from '../Auth/GQLAuth.guard';
import { CurrentUser } from '../User/CurrentUser.decorator';
import { User } from '../User/User.entity';
import { FriendsService } from './Friends.service';
import { Friends, FriendsInput} from './Friends.entity';

@Resolver('Friends')
export class FriendsResolver {
  userService: any;
  constructor(
    private readonly friendsService: FriendsService
    ) {}

  @UseGuards(GQLAuthGuard)
  @Query(() => [Friends])
  myFriends(@CurrentUser() user: User) {
    return this.friendsService.findbyOneId(user.id);
  }
  
  @UseGuards(GQLAuthGuard)
  @Query(() => [Friends])
  friends() {
    return this.friendsService.findAll();
  }

  @UseGuards(GQLAuthGuard)
  @Query(() => [Friends])
  getMyFridendById(
    @Args('userId') userId: string,
    @CurrentUser() me: User) {
      return this.friendsService.findByTwoId(me.id, userId);
  }

  @UseGuards(GQLAuthGuard)
  @Mutation(() => Friends)
  async addFriend(
    @Args('friend') friend: FriendsInput,
  ) {
        return this.friendsService.create(friend);
  }

  // ---------------------------------------------------------------------------
  // -------------------------------------------------------------------- Fields
  // ---------------------------------------------------------------------------

  // @ResolveField(() => UserWithPassword)
  // async user1(
  //   @Parent() friends: Friends,
  //   ) {
  //       const user = await this.userService.findById(friends.user1Id);
  //       if (!user) throw new NotFoundException('not found');
  //       return user;
  //   }

  //   @ResolveField(() => UserWithPassword)
  //   async user2(
  //     @Parent() friends: Friends,
  //     ) {
  //         const user = await this.userService.findById(friends.user2Id);
  //         if (!user) throw new NotFoundException('not found');
  //         return user; 
  //     }  

  }